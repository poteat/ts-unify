import type { TSESTree } from '@typescript-eslint/types'

import type { NodeWithBind } from '@/ast/node-with-bind'
import Sealed from '@/ast/sealed'
import type { Capture } from '@/capture'
import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

describe('node-with-bind', () => {
  it('bind(name) clears existing capture bag entries', () => {
    type Node = {
      type: 'BlockStatement'
      body: readonly [
        {
          type: 'ExpressionStatement'
          expression: Capture<'expr', TSESTree.Expression>
        },
      ]
    }

    function check(node: NodeWithBind<Node>) {
      const bound = node.bind('block')
      type Bag = ExtractCaptures<typeof bound>
      type Keys = keyof Bag
      AssertType.assertType<Keys, 'block'>(0)
      AssertType.assertType<'block', Keys>(0)
      type Value = Bag['block']
      type HasType = Value extends { type: string } ? true : false
      AssertType.assertType<HasType, true>(0)
    }

    void check
  })

  it('bind() uses the canonical name and applies Sealed', () => {
    type Node = {
      type: 'BlockStatement'
      body: readonly [
        {
          type: 'ExpressionStatement'
          expression: Capture<'expr', TSESTree.Expression>
        },
      ]
    }

    function check(node: NodeWithBind<Node>) {
      const bound = node.bind()
      type Bag = ExtractCaptures<typeof bound>
      type Keys = keyof Bag
      AssertType.assertType<Keys, 'node'>(0)
      AssertType.assertType<'node', Keys>(0)
      type Value = Bag['node']
      type HasType = Value extends { type: string } ? true : false
      AssertType.assertType<HasType, true>(0)
      type IsSealed = typeof bound extends {
        readonly [Sealed.SEALED_BRAND]: true
      }
        ? true
        : false
      AssertType.assertType<IsSealed, true>(0)
    }

    void check
  })

  it('with() adds new keys without restoring removed captures', () => {
    type Node = {
      type: 'BlockStatement'
      body: readonly [
        {
          type: 'ExpressionStatement'
          expression: Capture<'expr', TSESTree.Expression>
        },
      ]
    }

    function check(node: NodeWithBind<Node>) {
      const withSize = node
        .bind('block')
        .with(it => ({ size: it.block.type.length }))
      type Bag = ExtractCaptures<typeof withSize>
      type Keys = keyof Bag
      AssertType.assertType<Keys, 'block' | 'size'>(0)
      AssertType.assertType<'block' | 'size', Keys>(0)
      type BlockValue = Bag['block']
      type HasType = BlockValue extends { type: string } ? true : false
      AssertType.assertType<HasType, true>(0)
      type SizeValue = Bag['size']
      AssertType.assertType<SizeValue, number>(0)
    }

    void check
  })
})
