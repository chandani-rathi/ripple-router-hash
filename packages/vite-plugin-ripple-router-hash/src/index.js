import path from "node:path";
import fg from "fast-glob";

export default function rippleRoutesPlugin(options = { pagesDir : "src/pages", fileBasedRoutes: false}) {
  const pagesDir = options.pagesDir || "src/pages";
  const fileBasedRoutes = options.fileBasedRoutes;
  const virtualModuleId = "virtual:ripple-routes";
  const resolvedVirtualId = "\0" + virtualModuleId;

  function generateRoutes() {
    const pageFilter = fileBasedRoutes ? "**/*.ripple" : "**/page.ripple";
    const pageFiles = fg.sync(pageFilter, { cwd: pagesDir });
    const layoutFiles = fg.sync("**/layout.ripple", { cwd: pagesDir });

    const layouts = new Map();
    layoutFiles.forEach((file) => {
      const dir = path.posix.dirname(file.replace(/\\/g, "/"));
      const key = dir === "." ? "" : dir; // ✅ root layout key is ""
      layouts.set(key, `() => import("/${pagesDir}/${file}")`);
    });

    return pageFiles.map((file) => {
      const routePath = fileToRoutePath(file);
      const layoutChain = getLayoutChain(file, layouts);
      return `{
        path: "${routePath}",
        component: () => import("/${pagesDir}/${file}"),
        layouts: [${layoutChain.map(l=> `{id: "${l.id}", import: ${l.import} }`).join(", ")}],
      }`;
    });
  }

  function fileToRoutePath(file) {
    let route = "/" + file.replace(/\.ripple$/, "");
    route = route.replace(/\[([^\]]+)\]/g, ":$1");
    return (route === "/index" || route === "/page.ripple") ? "/" : route;
  }

  function getLayoutChain(file, layouts) {
    // Normalize to forward slashes for cross-platform consistency
    const normalizedFile = file.replace(/\\/g, "/");
    const dir = path.posix.dirname(normalizedFile);
    const dirParts = dir === "." ? [] : dir.split("/").filter(Boolean);

    const chain = [];
    let currentPath = "";

    // ✅ Check root layout first
    if (layouts.has("")) {
      chain.push({
        id: "",
        import: layouts.get("")
      });
    }

    // ✅ Walk subdirectories
    for (const part of dirParts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      if (layouts.has(currentPath)) {
        chain.push({
          id: currentPath,
          import : layouts.get(currentPath)
        });
      }
    }
    return chain;
  }
  let routeCode = "";

  function rebuild() {
    const routes = generateRoutes();
    routeCode = `export default [${routes.join(",\n")}];`;
  }

  return {
    name: "vite-plugin-ripple-routes",

    buildStart() {
      rebuild();
    },

    handleHotUpdate(ctx) {
      if (ctx.file.includes("page.ripple") || ctx.file.includes("layout.ripple")) {
        rebuild();
        ctx.server.ws.send({ type: "full-reload", path: "*" });
      }
    },

    resolveId(id) {
      if (id === virtualModuleId) return resolvedVirtualId;
    },

    load(id) {
      if (id === resolvedVirtualId) return routeCode;
    }
  };
}
