import type { Component } from "ripple";


declare type LinkProps = {
    to: string;
    query?: Record<string, string>;
    class?: string;
    children?: any;
    onClick?: (e: MouseEvent) => void;
    onMouseOver?: (e: MouseEvent) => void;
};

export declare const Link: Component<LinkProps>;

export interface UseRouterResult {
    route: any;
    navigateTo: (to: string, query?: Record<string, string>) => void;
}

export declare function useRouter(): UseRouterResult;