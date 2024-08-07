import Skillbar from "./skillbar"
import { BindsStorage } from "./storage"
import UI from "./ui"
import ChangeObserver from "./utils/observer"

const storage = new BindsStorage()
const ui = new UI()

function checkBind() {
    if (!storage.get(this.configbar.selectmenu.value)) {
        this.configbar.unbindbtn.disabled = true
    } else {
        this.configbar.unbindbtn.disabled = false
    }
}

async function openBag() {
    const bagState = ui.bag.get_state()
    if (bagState === false) {
        const waitfor = new Promise(res => { ui.onbag = () => res(bagState) })
        ui.bag.set_state(true, bagState)
        return waitfor
    } else {
        ui.bag.from_node(ui.bag.node)
    }
    return bagState
}

async function openStats() {
    const state = ui.playerstats.get_state()
    if (state === false) {
        const waitfor = new Promise(res => { ui.onplayerstats = () => res(state) })
        ui.playerstats.set_state(true, state)
        return waitfor
    } else {
        ui.playerstats.from_node(ui.playerstats.node)
    }
    return state
}

function removeSlots(slots) {
    const canvas = document.getElementsByTagName('canvas')?.[1]
    if (!canvas) return
    slots[0].node.dispatchEvent(new KeyboardEvent('keydown', { key: 'shift', bubbles: true })), setTimeout(() => {
        for (const slot of slots) {
            slot.node.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
            slot.node.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
            canvas.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
            canvas.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
        }
        slots[0].node.dispatchEvent(new KeyboardEvent('keyup', { key: 'shift', bubbles: true }))
    }, 100)
}

async function onselect() {
    if (!this.elements.applybtn.classList.contains('disabled')) return
    const presetName = this.configbar.selectmenu.value
    const preset = storage.get(presetName)
    if (preset) {
        const skillbar = new Skillbar()
        const [bagState, statsState] = await Promise.all([openBag(), openStats()])

        const available = Object.fromEntries([...ui.bag.slots, ...ui.playerstats.slots, ...this.skills].map(slot => [slot.id, slot]))
        const empty = []

        for (let i = 0; i < preset.length && i < skillbar.skills.length; i++) {
            const target = skillbar.skills[i]
            if (preset[i] !== target.id) {
                if (preset[i] === 'bg') empty.push(target)
                available[preset[i]]?.dispatch(target.node)
            }
        }

        if (empty.length) { removeSlots(empty) }
        ui.bag.set_state(bagState)
        ui.playerstats.set_state(statsState)
    }
    checkBind.call(this)
}

function ondelete(presetName) {
    storage.remove(presetName)
    checkBind.call(this)
}

function onbind() {
    const presetName = this.configbar.selectmenu.value
    if (["", "No Preset"].includes(presetName)) return

    const skillbar = new Skillbar()

    storage.set(presetName, skillbar.getIds())
    checkBind.call(this)
}

function onunbind() {
    const presetName = this.configbar.selectmenu.value
    storage.remove(presetName)
    checkBind.call(this)
}

ui.onskilllist = (list) => {
    list.onselect = onselect
    list.onbind = onbind
    list.onunbind = onunbind
    list.ondelete = ondelete

    checkBind.call(list)
}

const observer = new ChangeObserver(null, node => node.matches('.layout'), () => ui.init())
const init = () => {
    if (document.getElementById('skillbar')) {
        storage.init()
        ui.init()
        observer.observe(document.body)
    } else {
        setTimeout(init, 10)
    }
}

window.addEventListener('load', init)