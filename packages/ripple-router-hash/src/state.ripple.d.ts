import { Context } from "ripple";
import { HashState } from "./lib/hash-router";

export declare function useRouterState(): { state: HashState, navigateTo: (path: string, query: {[name:string]: string}) => void }

export const RouteContext: Context<any>