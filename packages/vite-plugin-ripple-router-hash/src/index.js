import { generateRoutes, generateRoutesTree } from "./routes.js";

export default function rippleRoutesPlugin(options = { pagesDir : "src/pages", fileBasedRoutes: false}) {
  const pagesDir = options.pagesDir || "src/pages";
  const fileBasedRoutes = options.fileBasedRoutes;
  const virtualModuleId = "virtual:ripple-routes";
  const resolvedVirtualId = "\0" + virtualModuleId;

  let routeCode = "";

  function rebuild() {
    console.log("fileBasedRoutes", fileBasedRoutes)
    const routes = generateRoutes({ pagesDir, fileBasedRoutes });
    const routesTree = {}//generateRoutesTree(routes);
    routeCode = `export default [${routes.join(",\n")}]; \n\n export const routesTree = ${JSON.stringify(routesTree, null, 4)}`;
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


