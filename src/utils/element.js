export default function createElement(tag, options) {
    const element = Object.assign(document.createElement(tag), options)

    element.css = (classList, clear = true) => {
        if (clear === false) classList = [...classList, ...element.classList]
        element.className = classList ? classList.join(" ") : null
        return element
    }

    element.append = (...nodes) => {
        for (const node of nodes) {
            element.appendChild(node)
        }
        return element
    }

    element.styles = (styles) => {
        Object.assign(element.style, styles)
        return element
    }

    element.text = (string) => {
        element.textContent = string
        return element
    }

    return element
}