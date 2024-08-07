export class BindsStorage {
    name = 'onex:skillbar-presets'
    #entries = {}

    init() {
        const storage = JSON.parse(localStorage.getItem(this.name))
        Object.assign(this.#entries, storage)
    }

    set(key, val) {
        this.#entries[key] = val
        localStorage.setItem(this.name, JSON.stringify(this.#entries))
    }

    get(key) {
        return this.#entries[key]
    }

    remove(key) {
        if (this.#entries[key]) {
            delete this.#entries[key]
            localStorage.setItem(this.name, JSON.stringify(this.#entries))
        }
    }
}