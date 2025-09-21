import { Context } from "ripple";
import { HashState } from "@/lib/hash-router";

export interface UseRouterStateResult {
	state: HashState;
	routes: any;
	navigateTo: (path: string, query?: { [name: string]: string }) => void;
}

export declare function useRouterState(): UseRouterStateResult;

export const RouteContext: Context<any>;