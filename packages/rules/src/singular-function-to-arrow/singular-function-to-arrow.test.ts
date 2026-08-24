import type { TSESTree } from '@typescript-eslint/types'

import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

import { singularFunctionToArrow } from './singular-function-to-arrow'

describe('singular-function-to-arrow', () => {
  it('captures function components and derived init', () => {
    type Bag = ExtractCaptures<(typeof singularFunctionToArrow)['from']>
    AssertType.assertType<Bag['async'], boolean>(0)
    AssertType.assertType<Bag['declare'], boolean>(0)
    AssertType.assertType<Bag['expression'], false>(0)
    AssertType.assertType<Bag['id'], TSESTree.Identifier | null>(0)
    AssertType.assertType<Bag['params'], TSESTree.Parameter[]>(0)
    AssertType.assertType<
      Bag['returnType'],
      TSESTree.TSTypeAnnotation | undefined
    >(0)
    AssertType.assertType<
      Bag['typeParameters'],
      TSESTree.TSTypeParameterDeclaration | undefined
    >(0)
    AssertType.assertType<
      Bag['body'],
      TSESTree.Expression | TSESTree.Statement
    >(0)
    AssertType.assertType<Bag['init'], TSESTree.Expression>(0)
    AssertType.assertType<
      keyof Bag,
      | 'async'
      | 'declare'
      | 'expression'
      | 'id'
      | 'params'
      | 'returnType'
      | 'typeParameters'
      | 'body'
      | 'init'
    >(0)
  })
})
