import { U, $ } from '@'
import type { NodeByKind } from '@/ast/node-by-kind'
import type { NodeWithWhen } from '@/ast/node-with-when'
import type { Capture } from '@/capture'
import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'
import type { KeysOfUnion } from '@/type-utils'

describe('node-with-when', () => {
  it('narrows single capture via value guard and applies to node shape', () => {
    type Node = {
      type: 'ReturnStatement'
      argument: Capture<'arg', string | number>
    }
    type NW = NodeWithWhen<Node>

    function check(res: NW) {
      const narrowed = res.when((x: string | number): x is string => {
        void x

        return true
      })
      type NodePart = Omit<typeof narrowed, 'when'>
      type ArgValue =
        NodePart['argument'] extends Capture<'arg', infer V> ? V : never
      AssertType.assertType<ArgValue, string>(0)
    }

    void check
  })

  it('narrows multiple captures via bag guard and applies to shape', () => {
    type Node = {
      type: 'X'
      aField: Capture<'a', number | null>
      bField: Capture<'b', string | number>
    }
    type NW = NodeWithWhen<Node>

    function check(res: NW) {
      const narrowed = res.when(
        (bag: {
          a: number | null
          b: string | number
        }): bag is {
          a: number
          b: string
        } => {
          void bag

          return true
        },
      )
      type NodePart = Omit<typeof narrowed, 'when'>
      type AVal = NodePart['aField'] extends Capture<'a', infer V> ? V : never
      type BVal = NodePart['bField'] extends Capture<'b', infer V> ? V : never
      AssertType.assertType<AVal, number>(0)
      AssertType.assertType<BVal, string>(0)
    }

    void check
  })

  it("collides with no AST node data field named 'when'", () => {
    type U = NodeByKind[keyof NodeByKind]
    type AllKeys = KeysOfUnion<U>
    type HasWhen = 'when' extends AllKeys ? true : false
    AssertType.assertType<HasWhen, false>(0)
  })

  describe('bag form on a single-capture node', () => {
    it('narrows a U.or capture through an annotated bag guard', () => {
      const key = U.or(
        U.Identifier({ name: $('key') }),
        U.Literal({ value: $('key') }),
      ).when(
        (bag: { key: unknown }): bag is { key: string } =>
          U.string.identifierName()(bag.key) && !U.string.reserved()(bag.key),
      )
      const p = U.Property({ key, value: U.Identifier({ name: $('name') }) })
      type Bag = ExtractCaptures<typeof p>
      AssertType.assertType<Bag['key'], string>(0)
      AssertType.assertType<Bag['name'], string>(0)
      expect(typeof p).toBe('function')
    })

    it('accepts an annotated bag predicate on a single-capture node', () => {
      const r = U.ReturnStatement({ argument: $('arg') }).when(
        (bag: { arg: unknown }) => bag.arg != null,
      )
      type Bag = ExtractCaptures<typeof r>
      AssertType.assertType<keyof Bag, 'arg'>(0)
      expect(typeof r).toBe('function')
    })
  })
})
