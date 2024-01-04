import { Fragment } from 'hono/jsx'

interface JSXNode {
  tag: keyof HTMLElementTagNameMap
  props?: { [key: string]: any }
  children?: (JSXNode | string)[]
}

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

  jsxNode.children?.forEach((child) => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child))
    } else if (typeof child === 'object' && 'tag' in child) {
      element.appendChild(jsxNodeToHTMLElement(child))
    } else {
      // @ts-expect-error child must have toString()
      element.appendChild(document.createTextNode(child.toString()))
    }
  })
  return element
}

export class Component {
  public elements: HTMLElement[] = []
  public render(): JSX.Element {
    return Fragment({})
  }
  public update(): void {
    const jsx = this.render()
    // @ts-expect-error jsx will be JSXNode
    const newElement = jsxNodeToHTMLElement(jsx)
    const parent = this.elements[0].parentElement
    if (parent) {
      parent.replaceChild(newElement, this.elements[0])
      this.elements = [newElement]
    }
  }
}

export const render = (c: any, element: HTMLElement) => {
  const Klass = c.tag
  const component = new Klass() as Component
  component.elements = [element]
  const jsx = component.render()
  // @ts-expect-error jsx will be JSXNode
  element.appendChild(jsxNodeToHTMLElement(jsx))
  component.elements = element.children as unknown as HTMLElement[]
}
