import path from "node:path";
import fg from "fast-glob";

export function generateRoutesTree(routes) {
  const routeTree = {
    id: "root",
    path: "",
    import: null,
    children: []
  };

  if (!routes || routes.length == 0) {
    return routeTree;
  }

  for (let route of routes) {
    const path = route.path;
    const segments = path.split("/").filter(Boolean);

    let parentRoute = routeTree;
    let currentId = routeTree.path;
    for (let part of segments) {
      const foundRoute = parentRoute.children.find(f => f.id == `${currentId}/${part}`);
      if (!foundRoute) {
        parentRoute.children.push({
          id: path,
          path: `${part}`,
          import: route.import,
          children: []
        })
      }
      else {
        parentRoute = foundRoute;
        currentId = `${currentId}/${part}`
      }
    }
  }

  return routeTree;
}

function fileToRoutePath(file, fileBasedRoutes) {
  let route = "/";
  if (fileBasedRoutes) {
    route = "/" + file.replace(/\.ripple$/, "");
    route = route.replace(/\/index$/, "");
    route = route.replace(/\[([^\]]+)\]/g, ":$1");
    return route === "/index" ? "/" : route;
  }
  else {
    route = "/" +  file.replace(/\/page.ripple$/, "");
    if(route === "/page.ripple") {
      route = "/"
    }
    route = route.replace(/\[([^\]]+)\]/g, ":$1");
    return route;
  }
  
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
        import: layouts.get(currentPath)
      });
    }
  }
  return chain;
}

export function generateRoutes({ pagesDir, fileBasedRoutes }) {
  const pageFilter = fileBasedRoutes ? "**/*.ripple" : "**/page.ripple";
  const ignorePageFilter = fileBasedRoutes ? ["**/_*.ripple"] : [];
  const pageFiles = fg.sync(pageFilter, { cwd: pagesDir, ignore: ignorePageFilter });

  const layoutFilter = fileBasedRoutes ? "**/_layout.ripple" : "**/layout.ripple";
  const layoutFiles = fg.sync(layoutFilter, { cwd: pagesDir });

  const layouts = new Map();
  layoutFiles.forEach((file) => {
    const dir = path.posix.dirname(file.replace(/\\/g, "/"));
    const key = dir === "." ? "" : dir; // ✅ root layout key is ""
    layouts.set(key, `() => import("/${pagesDir}/${file}")`);
  });

  return pageFiles.map((file) => {
    const routePath = fileToRoutePath(file, fileBasedRoutes);
    const layoutChain = getLayoutChain(file, layouts);
    return `{
        path: "${routePath}",
        component: () => import("/${pagesDir}/${file}"),
        layouts: [${layoutChain.map(l => `{id: "${l.id}", import: ${l.import} }`).join(", ")}],
      }`;
  });
}