import { effect } from "ripple";
import { animate } from "motion"

export function slideInSlideOut(options) {
    let _node;
    effect(() => {
        console.log("animation enter effect")
        animate(_node, { opacity: [0.8, 1], x: [_node.clientWidth, 0] }, { duration: 0.4 })
        return () => {
            console.log("animation exist effect")
            animate(_node, { opacity: [1, 0.8, 0.6, 0], x: [0, -_node.clientWidth] }, { duration: 0.4 })
        }
    })

    return node => {
        console.log("animation mounted")
        _node = node;
        
        return () => {
            console.log("animation unmounted")
            _node = undefined 
        }
    }
}

export function slideIn({ duration } = { duration: 0.4}) {
    return node => {
        animate(node, { opacity: [0.8, 1], x: [node.clientWidth, 0] }, { duration: (duration ?? 0.4) })
    }
}

export default {
    slideIn,
    slideInSlideOut
}