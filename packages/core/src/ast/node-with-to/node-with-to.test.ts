import type { TSESTree } from '@typescript-eslint/types'

import type { AstTransform } from '@/ast/ast-transform'
import type { NodeByKind } from '@/ast/node-by-kind'
import type { NodeWithTo } from '@/ast/node-with-to'
import type { Capture } from '@/capture'
import AssertType from '@/test-utils/assert-type'
import type { KeysOfUnion, WithoutInternalAstFields } from '@/type-utils'

describe('node-with-to', () => {
  it('exposes .to that returns an AstTransform', () => {
    type Node = {
      type: 'ReturnStatement'
      argument: Capture<'arg', string | number>
    }

    type N = Node & NodeWithTo<Node>

    function check(n: N) {
      const p = n.to<WithoutInternalAstFields<TSESTree.Node>>(bag => {
        void bag

        return {
          type: 'ReturnStatement',
          argument: {
            type: 'Identifier',
            name: 'result',
          },
        } as WithoutInternalAstFields<TSESTree.Node>
      })
      void (p as AstTransform<Node, WithoutInternalAstFields<TSESTree.Node>>)
    }

    void check
  })

  it("collides with no AST node data field named 'to'", () => {
    type U = NodeByKind[keyof NodeByKind]
    type AllKeys = KeysOfUnion<U>
    type HasTo = 'to' extends AllKeys ? true : false
    AssertType.assertType<HasTo, false>(0)
  })

  describe('zero-arg sugar', () => {
    it('allows zero-arg .to() when there is exactly one capture', () => {
      type Node = {
        type: 'ReturnStatement'
        argument: Capture<'expr', TSESTree.Expression>
      }

      type N = Node & NodeWithTo<Node>

      function check(n: N) {
        const p = n.to()
        void (p as AstTransform<Node, TSESTree.Expression>)
      }

      void check
    })

    it('disables zero-arg .to() for zero captures', () => {
      type Node = {
        type: 'Identifier'
        name: string
      }

      type N = Node & NodeWithTo<Node>

      const check = (n: N) => {
        // @ts-expect-error zero-arg sugar gated to single-capture only
        n.to()
      }

      void check
    })

    it('disables zero-arg .to() for multiple captures', () => {
      type Node = {
        type: 'IfStatement'
        test: Capture<'t', TSESTree.Expression>
        consequent: Capture<'c', TSESTree.Statement>
      }

      type N = Node & NodeWithTo<Node>

      const check = (n: N) => {
        // @ts-expect-error zero-arg sugar gated to single-capture only
        n.to()
      }

      void check
    })
  })
})
