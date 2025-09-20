# ripple-router-hash

A lightweight hash-based router library for [Ripple](https://github.com/trueadm/ripple) applications.
## Overview

`ripple-router-hash` provides client-side routing for Ripple apps using the URL hash (`#`). It enables navigation, route matching, and dynamic rendering of pages/components based on the hash path.
## Features
- Hash-based routing for SPA navigation
- Dynamic route matching (including params)
- Simple API for navigation and route definition
- Designed for Ripple framework

## Installation

```bash
npm install ripple-router-hash vite-plugin-ripple-router-hash
```
## Usage
### Step 1
Import and use the vite plugin:

```ts
import rippleRoutesPlugin from "vite-plugin-ripple-router-hash";

export default defineConfig({

   plugins: [ripple(), tailwindcss(), rippleRoutesPlugin({ pagesDir: "src/pages", fileBasedRoutes: false })],

}}

```

### Step 2
Import and use the router app in your Ripple app `src\index.ts`:

```ts 
import { createHashRouterApp } from 'ripple-router-hash';

createHashRouterApp({
   target: document.getElementById("roo")
})
```
See the sample project in [`apps/simple-hash`](./apps/simple-hash) for a complete example, including route definitions and navigation.

## Sample Project

The [`apps/simple-hash`](./apps/simple-hash) folder contains a minimal Ripple app using `ripple-router-hash`. Explore its `src/` and `pages/` directories to see:
- How to define routes
- How to use the `Link` component for navigation
- How to structure pages and layouts


## Routing Modes: File-based vs Folder-based

`ripple-router-hash` supports two modes for defining routes: **file-based** and **folder-based**. This gives you flexibility in how you organize your pages and layouts.

### 1. File-based Routing

Each route is defined by a single `.ripple` file. The file name (excluding extension) becomes the route path.

**Example Structure:**

```
src/pages/
   index.ripple         # route: /
   about.ripple         # route: /about
   dashboard.ripple     # route: /dashboard
```

Navigating to `#/about` will render `about.ripple`.

### 2. Folder-based Routing

Routes are defined by folders containing a `page.ripple` file. This allows for nested routes and layouts.

**Example Structure:**

```
src/pages/
   dashboard/
      page.ripple       # route: /dashboard
      settings/
         page.ripple   # route: /dashboard/settings
      users/
         [id]/
            page.ripple # route: /dashboard/users/:id
```

Navigating to `#/dashboard/settings` will render the corresponding `page.ripple`.

### Parameterized Routes

Use square brackets for dynamic segments:

```
src/pages/
   blog/
      [slug].ripple     # route: /blog/:slug (file-based)
   dashboard/
      users/
         [id]/
            page.ripple # route: /dashboard/users/:id (folder-based)
```

### Layouts

You can define `_layout.ripple` (file-based) or `layout.ripple` (folder-based) to wrap child routes.

**Example:**

```
src/pages/
   _layout.ripple       # wraps all routes (file-based)
   dashboard/
      layout.ripple     # wraps dashboard child routes (folder-based)
      page.ripple
      settings/
         page.ripple
```

### Page Component Structure

Each route can export:

- `Page`: Main component for the route
- `Error`: (Optional) Shown if loader throws/rejects
- `Loading`: (Optional) Shown while loading
- `loader`: (Optional) Async function to fetch data (receives route params)

**Example: Page Component with Loader**

```js
// page.ripple
export const loader = async ({ params }) => {
   // Fetch data using params.id
   const res = await fetch(`/api/projects/${params.id}`);
   if (!res.ok) throw new Error('Not found');
   return await res.json();
};

export component Page({ data }) => <div>Project Name: {data.name}</div>;
export component Error({ error }) => <div>Error: {error.message}</div>;
export component Loading() => <div>Loading...</div>;
```

## Navigation & Link Component

Use the `Link` component from `ripple-router-hash` for navigation:

```js
import { Link } from 'ripple-router-hash';

<Link to="/dashboard/settings">Go to Settings</Link>
```

## Development

To develop or test changes locally:

```bash
npm install
npm run build
```

## Development

To develop or test changes locally:

```bash
npm install
npm run build
```

## Formatting & Tooling

- Prettier with Ripple plugin is included for `.ripple` file formatting
- Recommended VS Code extensions:
   - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
   - [Ripple](https://marketplace.visualstudio.com/items?itemName=ripplejs.ripple-vscode-plugin)

## Resources

- [Ripple Documentation](https://github.com/trueadm/ripple)
- [Vite Documentation](https://vitejs.dev/)
