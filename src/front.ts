import { JSXNode, Component as BaseComponent, jsx as jsxFn } from 'hono/jsx'

const jsxNodeToHTMLElement = (jsxNode: JSXNode): HTMLElement => {
  const tagName = typeof jsxNode.tag === 'string' ? jsxNode.tag : 'fragment'
  const element: HTMLElement = document.createElement(tagName)

  if (jsxNode.props) {
    Object.keys(jsxNode.props).forEach((prop) => {
      if (prop.startsWith('on') && typeof jsxNode.props![prop] === 'function') {
        const eventName: string = prop.toLowerCase().substring(2)
        element.addEventListener(eventName, jsxNode.props![prop])
      } else {
        element.setAttribute(prop, jsxNode.props![prop])
      }
    })
  }

  jsxNode.children?.forEach(async (child) => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child))
    } else if (typeof child === 'object' && 'tag' in child) {
      if (typeof child.tag === 'function') {
        element.appendChild(jsxNodeToHTMLElement(await child.tag()))
      } else {
        element.appendChild(jsxNodeToHTMLElement(child))
      }
    } else {
      element.appendChild(document.createTextNode(child.toString()))
    }
  })
  return element
}

export class Component extends BaseComponent {
  elements: HTMLElement[] = []
  async update() {
    const jsx = await this.render()
    // @ts-expect-error jsx will be JSXNode
    const newElement = jsxNodeToHTMLElement(jsx).children[0]
    const parent = this.elements[0].parentElement
    if (parent) {
      parent.replaceChild(newElement, this.elements[0])
      this.elements = [newElement]
    }
  }
}

export const classToComponent = (c: any) => {
  const Klass = c.tag
  return new Klass() as Component
}

export const hydrate = async (c: any) => {
  const component = classToComponent(c)
  const jsx = await component.render()
  const id = jsx.props['id']
  const element = document.querySelector<HTMLElement>(`#${id}`)
  element?.replaceChild(jsxNodeToHTMLElement(jsx).children[0], element.children[0])
  component.elements = element!.children as unknown as HTMLElement[]
}
