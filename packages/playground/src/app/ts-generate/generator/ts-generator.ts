import type {
  GeneratorNode,
  GeneratorTable,
} from '@ts-unify/playground/app/ts-generate/types'
import { GENERATOR } from 'astring'
import type { State } from 'astring'

import Write from './write'

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
    Write.writeTypeAnnotation(this, state, node)
  },

  ArrowFunctionExpression(node: GeneratorNode, state: State) {
    state.write(node.async ? 'async ' : '', node)
    const { params } = node

    if (params != null) {
      const isBareParam =
        params.length === 1 &&
        params[0].type === 'Identifier' &&
        !params[0].typeAnnotation

      if (isBareParam) {
        state.write(params[0].name, params[0])
      } else {
        state.write('(')
        Write.writeList(this, state, params)
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
    Write.writeWrappedType(this, state, node)
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
      Write.writeList(this, state, args.params)
      state.write('>')
    }
  },

  TSQualifiedName(node: GeneratorNode, state: State) {
    this[node.left.type](node.left, state)
    state.write('.')
    state.write(node.right.name)
  },
  TSUnionType(node: GeneratorNode, state: State) {
    Write.writeSeparated({
      table: this,
      state,
      nodes: node.types,
      separator: ' | ',
    })
  },
  TSIntersectionType(node: GeneratorNode, state: State) {
    Write.writeSeparated({
      table: this,
      state,
      nodes: node.types,
      separator: ' & ',
    })
  },
  TSArrayType(node: GeneratorNode, state: State) {
    this[node.elementType.type](node.elementType, state)
    state.write('[]')
  },
  TSTupleType(node: GeneratorNode, state: State) {
    state.write('[')
    Write.writeList(this, state, node.elementTypes)
    state.write(']')
  },
  TSLiteralType(node: GeneratorNode, state: State) {
    const isLiteral = node.literal.type === 'Literal'

    isLiteral
      ? this.Literal(node.literal, state)
      : this[node.literal.type](node.literal, state)
  },
  TSTypeLiteral(node: GeneratorNode, state: State) {
    state.write('{ ')
    Write.writeSeparated({
      table: this,
      state,
      nodes: node.members,
      separator: '; ',
    })
    state.write(' }')
  },
  TSPropertySignature(node: GeneratorNode, state: State) {
    if (node.readonly) state.write('readonly ')
    this[node.key.type](node.key, state)
    if (node.optional) state.write('?')
    Write.writeTypeAnnotation(this, state, node)
  },
  TSFunctionType(node: GeneratorNode, state: State) {
    state.write('(')

    if (node.params) {
      Write.writeList(this, state, node.params)
    }

    state.write(')')
    const ret = node.returnType ?? node.typeAnnotation

    if (ret) {
      state.write(' => ')
      const isTypeAnnotation = ret.type === 'TSTypeAnnotation'

      isTypeAnnotation
        ? Write.writeWrappedType(this, state, ret)
        : Write.writeNode(this, state, ret)
    }
  },
  TSParenthesizedType(node: GeneratorNode, state: State) {
    state.write('(')
    Write.writeWrappedType(this, state, node)
    state.write(')')
  },
  TSTypeQuery(node: GeneratorNode, state: State) {
    state.write('typeof ')
    this[node.exprName.type](node.exprName, state)
  },
  TSAsExpression(node: GeneratorNode, state: State) {
    this[node.expression.type](node.expression, state)
    state.write(' as ')
    Write.writeWrappedType(this, state, node)
  },
}
