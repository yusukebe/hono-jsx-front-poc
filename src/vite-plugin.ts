import fs from 'fs/promises'
import { parse } from '@babel/parser'
import _traverse from '@babel/traverse'
const traverse = _traverse.default
import _generate from '@babel/generator'
const generate = _generate.default
import * as t from '@babel/types'
import type { Plugin } from 'vite'

function wrapRenderMethod(ast: t.File, componentName: string) {
  traverse(ast, {
    ClassDeclaration(path) {
      if (path.node.superClass && t.isIdentifier(path.node.superClass) && path.node.superClass.name === 'Component') {
        path.node.body.body.forEach((method) => {
          if (
            t.isClassMethod(method) &&
            method.kind === 'method' &&
            t.isIdentifier(method.key) &&
            method.key.name === 'render'
          ) {
            const returnStatement = method.body.body.find((statement) => t.isReturnStatement(statement)) as
              | t.ReturnStatement
              | undefined

            if (returnStatement && returnStatement.argument) {
              returnStatement.argument = t.jsxElement(
                t.jsxOpeningElement(
                  t.jsxIdentifier('hono-component'),
                  [t.jsxAttribute(t.jsxIdentifier('id'), t.stringLiteral(componentName))],
                  false
                ),
                t.jsxClosingElement(t.jsxIdentifier('hono-component')),
                [returnStatement.argument],
                false
              )
            }
          }
        })
      }
    }
  })
}

function componentTransformerPlugin(): Plugin {
  return {
    name: 'component-transformer',
    async load(id) {
      if (id.endsWith('.tsx')) {
        const contents = await fs.readFile(id, 'utf8')
        const ast = parse(contents, {
          sourceType: 'module',
          plugins: ['jsx', 'typescript']
        })
        const componentName = id.split('/').pop()?.replace('.tsx', '')
        if (componentName) {
          wrapRenderMethod(ast, componentName)
          const { code } = generate(ast, { sourceMaps: true }, contents)
          return { code, map: null }
        }
      }
    }
  }
}

export default componentTransformerPlugin
