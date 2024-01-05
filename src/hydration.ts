import { Fragment, JSXNode, jsx as jsxFn } from 'hono/jsx'

const COMPONENT_TAG_NAME = 'hono-component'

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

const toHash = (str: string): string => {
  let i = 0,
    out = 11
  while (i < str.length) {
    out = (101 * out + str.charCodeAt(i++)) >>> 0
  }
  return 'component-' + out
}

const _render = async (c: Component) => {
  const jsx = await c.render()
  const hash = toHash(JSON.stringify(jsx))
  const wrappedJSX = jsxFn(COMPONENT_TAG_NAME, { id: hash }, [jsx])
  return wrappedJSX
}

export class Component extends JSXNode {
  elements: HTMLElement[] = []
  async render(): JSX.Element {
    return Fragment({})
  }
  async update() {
    const jsx = await this.render()
    // @ts-expect-error jsx will be JSXNode
    const newElement = jsxNodeToHTMLElement(jsx)
    const parent = this.elements[0].parentElement
    if (parent) {
      parent.replaceChild(newElement, this.elements[0])
      this.elements = [newElement]
    }
  }
  async toString() {
    return await _render(this)
  }
}

export const classToComponent = (c: any) => {
  const Klass = c.tag
  return new Klass() as Component
}

export const renderComponent = (c: any) => {
  const component = classToComponent(c)
  return component.toString()
}

export const hydrate = async (c: any) => {
  const component = classToComponent(c)
  const ele = await _render(component)
  const id = ele.props['id']
  const element = document.querySelector<HTMLElement>(`#${id}`)
  const jsx = await component.render()
  element?.replaceChild(jsxNodeToHTMLElement(jsx), element.children[0])
  component.elements = element!.children as unknown as HTMLElement[]
}
