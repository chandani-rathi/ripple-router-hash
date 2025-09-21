// hash-router.js
export interface HashRouterType {
    routes?: any[],
    onRouteChange?: ({ path, route, params, query }) => void,
    rootPage?: string;
    doubleBackExit?: boolean
    middlewares?: any[]
}

export interface HashState {

}

export declare function onRouteChange(
    { path, route, params, query } : { 
        path: string, 
        route: string, 
        params: { [name: string]: string }, 
        query: { [name: string]: string }
    }) : void

export class HashRouter {

    routes: { pattern: any; regex: RegExp; keys: any[]; }[];
    onRouteChange: typeof onRouteChange;
    rootPage: string;
    doubleBackExit: boolean;
    scrollPositions: Map<any, any>;
    middlewares: any[];
    lastBackPress: number;
    onRouteChangeEvents: typeof onRouteChange[];
    lastState: { path: string, route: string, params: { [name: string]: string }, query: { [name: string]: string } }

    constructor({
        routes = [],
        onRouteChange,
        rootPage = "",
        doubleBackExit = true,
        middlewares = []
    }: HashRouterType = {}) {

        this.routes = routes.map(this.compileRoute);
        this.onRouteChange = onRouteChange;
        this.rootPage = rootPage;
        this.doubleBackExit = doubleBackExit;
        this.middlewares = middlewares;
        this.scrollPositions = new Map();
        this.lastBackPress = 0;
        this.onRouteChangeEvents = [];
        this.lastState = { path: "/", route: "/", params: {}, query: {}}

        this.handlePopState = this.handlePopState.bind(this);
        window.addEventListener("popstate", this.handlePopState);

        // Init
        const { path, query } = this.parseHash();

        history.replaceState(
            { hash: this.buildHash(path, query), path, query },
            "",
            this.buildHash(path, query)
        );
        this.navigateInternal(path, query, { replace: true });
    }

    compileRoute(routePattern) {
        const keys = [];
        const regexStr = routePattern
            //.replace(/\/$/, "")
            .replace(/:[^/]+/g, (match) => {
                keys.push(match.slice(1));
                return "([^/]+)";
            });
        return { pattern: routePattern, regex: new RegExp(`^${regexStr}$`), keys };
    }

    parseHash() {
        const hash = location.hash.replace(/^#/, "");
        let [path, search] = hash.split("?");
        const query = Object.fromEntries(new URLSearchParams(search || ""));
        if (path == "") {
            path = "/"
        }
        return { path: path || this.rootPage, query };
    }

    buildHash(path, query = {}) {
        const search = new URLSearchParams(query).toString();
        return search ? `#${path}?${search}` : `#${path}`;
    }

    async navigate(path, query = {}) {
        await this.navigateInternal(path, query, { replace: false });
    }

    async navigateInternal(path, query, { replace }) {
        const hash = this.buildHash(path, query);
        const { route, params } = this.matchRoute(path);

        // 🟢 Run middlewares sequentially
        for (const mw of this.middlewares) {
            const result = await mw({ path, route, params, query, navigate: this.navigate.bind(this) });
            if (result === false) {
                // Cancel navigation
                if (replace) {
                    // Restore previous state if we canceled on initial load
                    history.replaceState({ hash: location.hash, path: this.rootPage, query: {} }, "", location.hash);
                }
                return;
            }
        }

        // Update history
        if (replace) {
            history.replaceState({ hash, path, query }, "", hash);
        } else {
            history.pushState({ hash, path, query }, "", hash);
        }

        this.triggerRouteChange(path, query);
    }

    matchRoute(path) {
        for (const route of this.routes) {
            const match = path.match(route.regex);
            if (match) {
                const params = {};
                route.keys.forEach((k, i) => (params[k] = decodeURIComponent(match[i + 1])));
                return { route: route.pattern, params };
            }
        }
        return { route: null, params: {} };
    }

    triggerRouteChange(path, query) {
        // Save scroll for previous route
        const currentHash = history.state?.hash;
        if (currentHash) {
            this.scrollPositions.set(currentHash, window.scrollY);
        }

        const savedScroll = this.scrollPositions.get(this.buildHash(path, query)) || 0;
        setTimeout(() => window.scrollTo(0, savedScroll), 0);

        const { route, params } = this.matchRoute(path);
        if (typeof this.onRouteChange === "function") {
            this.onRouteChange({ path, route, params, query });
        }
        this.lastState = { path, route, params, query };
        setTimeout(() => {
            this.triggerEvents();
        },)

    }

    handlePopState(event) {
        const state = event.state;
        const { path, query } = state || this.parseHash();

        if (path === this.rootPage && this.doubleBackExit && history.length <= 2) {
            const now = Date.now();
            if (now - this.lastBackPress < 2000) {
                window.history.back();
            } else {
                this.lastBackPress = now;
                //alert("Press back again to exit");
                history.pushState(
                    { hash: this.buildHash(this.rootPage), path: this.rootPage, query: {} },
                    "",
                    `#${this.rootPage}`
                );
            }
        } else {
            this.navigateInternal(path, query, { replace: true });
        }
    }

    triggerEvents() {
        this.onRouteChangeEvents.forEach(
            event => {
                event({ ...this.lastState });
            }
        )
    }

    addEvent(event) {
        if (typeof event != "function") return;
        this.onRouteChangeEvents.push(event)
    }

    removeEvent(event) {
        const index = this.onRouteChangeEvents.findIndex(event);
        this.onRouteChangeEvents.splice(index, 1)
    }

    destroy() {
        this.onRouteChangeEvents.splice(0, this.onRouteChangeEvents.length)
        window.removeEventListener("popstate", this.handlePopState);
    }
}
