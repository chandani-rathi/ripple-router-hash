
export function findRoute(currentPath, routes) {
  let route = null;
  for (const r of routes) {
    const params = matchPath(r.path, currentPath);
    if (params) {
		  route = { ...r, params};
	  }
  }
  if(route == null && routes.length > 0){
    const defaultLayout = routes[0].layouts;
    route = { layouts: defaultLayout}
  }
  return {...route, path: currentPath};
}

function matchPath(pattern, pathname) {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);

  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      const key = patternParts[i].slice(1);
      params[key] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}
