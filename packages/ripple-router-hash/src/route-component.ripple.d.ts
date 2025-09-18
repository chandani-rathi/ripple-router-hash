import type { Component } from "ripple";

export type DynamicDataProps = {
    $component: Function, 
    $data: {[key:string]: string}, 
    $children: Component
}

export declare function DynamicDataComponent({ $component, $data, $children }): Component

export type RouteProp = {
    id: string,
    path: string,
    children: RouteProp[]
    import: () => any
    props: {[key:string]: string}
}

export declare function RouteComponent({ $component }: { $component: RouteProp}): Component