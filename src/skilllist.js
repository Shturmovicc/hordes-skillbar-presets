import Slot from "./slot"
import { Button } from "./utils/button"
import ChangeObserver from "./utils/observer"

class ConfigBar {
    constructor() {
        this.node = null
        this.observer = new ChangeObserver(this.node, node => node.nodeName === 'SELECT', this.onreload.bind(this))

        this.bindbtn = new Button('div')
        this.bindbtn.node.text('Bind').css(['btn', 'grey'], false).styles({ width: 'fit-content' })
        this.unbindbtn = new Button('div')
        this.unbindbtn.node.text('Unbind').css(['btn', 'grey'], false).styles({ width: 'fit-content' })
    }

    init(node) {
        this.node = node
        this.observer.observe(this.node)
        this.onreload()
        return this
    }

    onremove() {
        this.node.style.removeProperty('grid-template-columns')
        this.bindbtn.node.remove()
        this.unbindbtn.node.remove()
    }

    onreload() {
        [this._, this.selectmenu, this.savebtn, this.deletebtn] = this.node.children
        this.savebtn.addEventListener('click', this.onremove.bind(this))
        this.selectmenu.addEventListener('change', () => this.onselect())

        let val = ""
        this.deletebtn.addEventListener('mouseup', () => val = this.selectmenu.value)
        this.deletebtn.addEventListener('click', () => this.ondelete(val))

        this.node.style['grid-template-columns'] = "auto 200px auto auto auto 1fr"
        this.node.appendChild(this.bindbtn.node)
        this.node.appendChild(this.unbindbtn.node)
    }

    onselect() { }
    ondelete() { }
}

export default class Skilllist {
    constructor(skills, elements) {
        this.skills = skills
        this.elements = elements

        this.configbar = new ConfigBar()
        if (this.elements.bartop) this.configbar.init(this.elements.bartop)

        this.observer = new ChangeObserver(this.elements.slot.firstChild, node => node.matches('.bar-top-config'), node => this.configbar.init(node))

        this.configbar.onselect = () => this.onselect()
        this.configbar.ondelete = (val) => this.ondelete(val)
        this.configbar.bindbtn.callback = () => this.onbind()
        this.configbar.unbindbtn.callback = () => this.onunbind()

        let state = false
        this.elements.applybtn.addEventListener('mouseup', () => { state = !this.elements.applybtn.matches('.disabled') })
        this.elements.applybtn.addEventListener('click', () => { if (state) this.onselect() })
    }

    static from_node(node) {
        const window = node.firstChild
        const [titleframe, slot] = window.children

        const bartop = slot.firstChild.querySelector('.bar-top-config')
        const skilllist = slot.firstChild.querySelector('.skilllist')
        const applybtn = document.getElementById('tutapplyskills')

        const skills = [...skilllist.children].map(child => Slot.from_node(child.firstChild))

        return new this(skills, {
            window,
            titleframe,
            slot,
            bartop,
            skilllist,
            applybtn
        })
    }

    onselect() { }
    ondelete() { }
    onbind() { }
    onunbind() { }
}