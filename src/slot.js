const idRegex = /(?<=\/)\w+(?=\.(webp|avif|png|jpg|jpeg))/

export default class Slot {
    constructor(id, node) {
        this.id = id
        this.node = node
    }

    static from_node(node) {
        const icon = node.lastChild
        const id = idRegex.exec(icon.src)?.[0].replace(/_\w+/g, '')

        return new this(id, node)
    }

    dispatch(target, shift) {
        if (shift) {
            this.node.dispatchEvent(new KeyboardEvent('keydown', { key: 'shift', bubbles: true })), setTimeout(() => {
                this.dispatch(target)
                this.node.dispatchEvent(new KeyboardEvent('keyup', { key: 'shift', bubbles: true }))
            }, 100)
        } else {
            this.node.dispatchEvent(new PointerEvent('pointerdown'), { shiftKey: true })
            this.node.dispatchEvent(new PointerEvent('pointerup'), { shiftKey: true })
            target?.dispatchEvent(new PointerEvent('pointerup'))
        }
    }
}