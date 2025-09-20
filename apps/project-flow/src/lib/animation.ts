
import { animate } from "motion"

export function slideInSlideOut(options) {
    return node => {
        animate(node, { opacity: [0.8, 1], x: [node.clientWidth, 0] }, { duration: 0.4 })
        return () => {
            return animate(node, { opacity: [1, 0.8, 0.6, 0], x: [0, -node.clientWidth] }, { duration: 0.4 })
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