import Slot from "./slot"

export default class Skillbar {
    constructor() {
        this.element = document.getElementById('skillbar')
        this.skills = [...this.element.children].map(child => Slot.from_node(child))
    }

    getIds() {
        return this.skills.map(skill => skill.id)
    }
}