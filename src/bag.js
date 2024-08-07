import Slot from "./slot"

export default class Bag {
    constructor() {
        this.node = null
        this.button = null
        this.slots = null
    }

    toggle() {
        if (this.button && this.button.isConnected) {
            this.button.dispatchEvent(new MouseEvent('click'))
        } else {
            this.button = document.getElementById('sysbag')
            this.toggle()
        }
    }

    set_state(state, current) {
        if (state !== (current || this.get_state())) {
            this.toggle()
        }
    }

    get_state() {
        return document.querySelector('#bag0') ? true : false
    }

    from_node(node) {
        this.node = node
        this.slots = [...node.querySelector('.slotcontainer').children].map(child => Slot.from_node(child))
        return this
    }
}