import { GENERATOR } from 'astring'
import type { State } from 'astring'

import type { GeneratorNode } from './generator-node'
import type { GeneratorTable } from './generator-table'
import { writeSeparated } from './write-separated'
import { writeTypeAnnotation } from './write-type-annotation'

/**
 * astring's generator extended with the TypeScript nodes a captured
 * TSESTree subtree may carry, so they reach the output.
 *
 * Parameter and return types, type references, unions, tuples, literals
 * and the rest; astring alone drops them.
 */
export const tsGenerator: GeneratorTable = {
  ...GENERATOR,

  Identifier(node: GeneratorNode, state: State) {
    state.write(node.name, node)
    writeTypeAnnotation(this, node, state)
  },

  ArrowFunctionExpression(node: GeneratorNode, state: State) {
    state.write(node.async ? 'async ' : '', node)
    const { params } = node

    if (params != null) {
      if (
        params.length === 1 &&
        params[0].type === 'Identifier' &&
        !params[0].typeAnnotation
      ) {
        state.write(params[0].name, params[0])
      } else {
        state.write('(')
        writeSeparated({ table: this, state, nodes: params, separator: ', ' })
        state.write(')')
      }
    }

    if (node.returnType) this.TSTypeAnnotation(node.returnType, state)
    state.write(' => ')

    if (node.body.type === 'ObjectExpression') {
      state.write('(')
      this.ObjectExpression(node.body, state)
      state.write(')')
    } else {
      this[node.body.type](node.body, state)
    }
  },

  TSTypeAnnotation(node: GeneratorNode, state: State) {
    state.write(': ')
    this[node.typeAnnotation.type](node.typeAnnotation, state)
  },
  TSStringKeyword(_n: GeneratorNode, state: State) {
    state.write('string')
  },
  TSNumberKeyword(_n: GeneratorNode, state: State) {
    state.write('number')
  },
  TSBooleanKeyword(_n: GeneratorNode, state: State) {
    state.write('boolean')
  },
  TSVoidKeyword(_n: GeneratorNode, state: State) {
    state.write('void')
  },
  TSAnyKeyword(_n: GeneratorNode, state: State) {
    state.write('any')
  },
  TSUnknownKeyword(_n: GeneratorNode, state: State) {
    state.write('unknown')
  },
  TSNeverKeyword(_n: GeneratorNode, state: State) {
    state.write('never')
  },
  TSNullKeyword(_n: GeneratorNode, state: State) {
    state.write('null')
  },
  TSUndefinedKeyword(_n: GeneratorNode, state: State) {
    state.write('undefined')
  },
  TSBigIntKeyword(_n: GeneratorNode, state: State) {
    state.write('bigint')
  },
  TSSymbolKeyword(_n: GeneratorNode, state: State) {
    state.write('symbol')
  },
  TSObjectKeyword(_n: GeneratorNode, state: State) {
    state.write('object')
  },

  TSTypeReference(node: GeneratorNode, state: State) {
    this[node.typeName.type](node.typeName, state)
    const args = node.typeArguments ?? node.typeParameters

    if (args) {
      state.write('<')
      writeSeparated({
        table: this,
        state,
        nodes: args.params,
        separator: ', ',
      })
      state.write('>')
    }
  },

  TSQualifiedName(node: GeneratorNode, state: State) {
    this[node.left.type](node.left, state)
    state.write('.')
    state.write(node.right.name)
  },
  TSUnionType(node: GeneratorNode, state: State) {
    writeSeparated({ table: this, state, nodes: node.types, separator: ' | ' })
  },
  TSIntersectionType(node: GeneratorNode, state: State) {
    writeSeparated({ table: this, state, nodes: node.types, separator: ' & ' })
  },
  TSArrayType(node: GeneratorNode, state: State) {
    this[node.elementType.type](node.elementType, state)
    state.write('[]')
  },
  TSTupleType(node: GeneratorNode, state: State) {
    state.write('[')
    writeSeparated({
      table: this,
      state,
      nodes: node.elementTypes,
      separator: ', ',
    })
    state.write(']')
  },
  TSLiteralType(node: GeneratorNode, state: State) {
    node.literal.type === 'Literal'
      ? this.Literal(node.literal, state)
      : this[node.literal.type](node.literal, state)
  },
  TSTypeLiteral(node: GeneratorNode, state: State) {
    state.write('{ ')
    writeSeparated({ table: this, state, nodes: node.members, separator: '; ' })
    state.write(' }')
  },
  TSPropertySignature(node: GeneratorNode, state: State) {
    if (node.readonly) state.write('readonly ')
    this[node.key.type](node.key, state)
    if (node.optional) state.write('?')
    writeTypeAnnotation(this, node, state)
  },
  TSFunctionType(node: GeneratorNode, state: State) {
    state.write('(')

    if (node.params) {
      writeSeparated({
        table: this,
        state,
        nodes: node.params,
        separator: ', ',
      })
    }

    state.write(')')
    const ret = node.returnType ?? node.typeAnnotation

    if (ret) {
      state.write(' => ')

      ret.type === 'TSTypeAnnotation'
        ? this[ret.typeAnnotation.type](ret.typeAnnotation, state)
        : this[ret.type](ret, state)
    }
  },
  TSParenthesizedType(node: GeneratorNode, state: State) {
    state.write('(')
    this[node.typeAnnotation.type](node.typeAnnotation, state)
    state.write(')')
  },
  TSTypeQuery(node: GeneratorNode, state: State) {
    state.write('typeof ')
    this[node.exprName.type](node.exprName, state)
  },
  TSAsExpression(node: GeneratorNode, state: State) {
    this[node.expression.type](node.expression, state)
    state.write(' as ')
    this[node.typeAnnotation.type](node.typeAnnotation, state)
  },
}
