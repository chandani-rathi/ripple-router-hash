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

   plugins: [ripple(), tailwindcss(), rippleRoutesPlugin({ pagesDir: "src/pages" })],

}}

```

### Step 2
Import and use the router in your Ripple app:

```ts
import { HashRouterApp } from 'ripple-router-hash';

<HashRouterApp>
   {/* Your routes/components here */}
</HashRouterApp>
```
See the sample project in [`apps/simple-hash`](./apps/simple-hash) for a complete example, including route definitions and navigation.

## Sample Project

The [`apps/simple-hash`](./apps/simple-hash) folder contains a minimal Ripple app using `ripple-router-hash`. Explore its `src/` and `pages/` directories to see:
- How to define routes
- How to use the `Link` component for navigation
- How to structure pages and layouts

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
