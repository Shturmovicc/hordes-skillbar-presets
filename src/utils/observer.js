export default class ChangeObserver {
    constructor(target, check, callback) {
        this.target = target
        this.check = check
        this.callback = callback

        this.observer = new MutationObserver(this.onmutation.bind(this))
        if (this.target) this.observe(this.target)
    }

    onmutation(mutationList) {
        mutationList.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (this.check(node)) {
                    this.callback(node)
                }
            })
        })
    }

    observe(node, args) {
        this.observer.observe(node, args || { childList: true })
    }

    disconnect() {
        this.observer.disconnect()
    }
}