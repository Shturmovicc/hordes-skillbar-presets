import Bag from "./bag"
import PlayerStats from "./playerstats"
import Skilllist from "./skilllist"
import ChangeObserver from "./utils/observer"

export default class UI {
    constructor() {
        this.element = null
        this.bag = new Bag()
        this.playerstats = new PlayerStats()
        this.observer = new ChangeObserver(null, node => node.matches('.window-pos'), this.onwindow.bind(this))
    }

    init() {
        this.element = document.querySelector(".container:has(> .container.uiscaled)")
        this.observer.observe(this.element, { childList: true })
        this.element.querySelectorAll('.window-pos').forEach(node => this.onwindow(node))
    }

    onwindow(node) {
        if (node.querySelector('.skilllist')) this.onskilllist(Skilllist.from_node(node))
        if (node.querySelector('#bag0')) this.onbag(this.bag.from_node(node))
        if (node.querySelector('#equipslots')) this.onplayerstats(this.playerstats.from_node(node))
    }

    onskilllist(list) { }
    onbag(bag) { }
    onplayerstats(stats) { }
}