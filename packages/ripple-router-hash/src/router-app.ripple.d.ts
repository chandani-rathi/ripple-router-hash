import type { Component } from "ripple";

export declare function createHashRouterApp({ target }: { target: HTMLElement}): void

export type RouteApp = Component | (() => void)