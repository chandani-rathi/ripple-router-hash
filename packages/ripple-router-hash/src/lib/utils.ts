import { RippleArray } from 'ripple';

export function getHashPath() {
  return window.location.hash.replace(/^#/, "") || "/";
}


export function arrayToTree(arr) {
  if (!arr.length) return new RippleArray();

  // Start from the last element and build backwards
  let tree = { ...arr[arr.length - 1], children: new RippleArray() };

  for (let i = arr.length - 2; i >= 0; i--) {
    tree = { ...arr[i], children: new RippleArray(tree) };
  }

  return new RippleArray(tree);
}

export function updateTree(newTree, oldTree){
	console.log("update tree", newTree, oldTree)
	if (!oldTree) return newTree;

	if(!newTree) return new RippleArray();

	if(oldTree.length == 0 && newTree.length == 0) {

	}
	else if(oldTree.length == 0 && newTree.length > 0) {
		oldTree.push(newTree[0])
	}
	else if(oldTree.length > 0 && newTree.length == 0) {
		oldTree.splice(0, 1)
	}
	else if(newTree.length > 0 && oldTree.length > 0){
		if(newTree[0].id != oldTree[0].id) {
			oldTree.splice(0, 1)
			oldTree.push(newTree[0])
		}
		else {
			updateTree(newTree[0].children, oldTree[0].children)
		}
	}

	return oldTree;
}

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

export function matchPath(pattern, pathname) {
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
