export function generateRoutesTree(routes){
  const routeTree = {
        id: "root",
        path: "",
        import: null,
        children: []
  };
  const startingRoute = "";
  if(!routes || routes.length == 0) {
    return routeTree;
  }
  for(let route of routes) {
    const path = route.path;
    const segments = path.split("/").filter(Boolean)
    console.log("", path, segments);
    let parentRoute = routeTree;
    for(let part of segments) {
        const foundRoute = parentRoute.children.find(f => f.id == part);
            if(!foundRoute) {
                parentRoute.children.push({
                    id: part,
                    path: `${part}`,
                    import: route.import,
                    children: []
                })
        }
        else {
            parentRoute = foundRoute
        }
    }
  }

  return routeTree;
}