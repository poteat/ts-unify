import type { NodeByKind } from '@/ast/node-by-kind'
import type { NodeWithSeal } from '@/ast/node-with-seal'
import type { Sealed } from '@/ast/sealed'
import type { Capture } from '@/capture'
import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'
import type { KeysOfUnion } from '@/type-utils'

describe('node-with-seal', () => {
  it('re-keys a single inner capture to the parent property', () => {
    type Inner = { type: 'ReturnStatement'; argument: Capture<'arg', number> }
    type Pattern = {
      test: Capture<'t'>
      consequent: Sealed<Inner>
      alternate: Capture<'a'>
    }
    type Bag = ExtractCaptures<Pattern>
    AssertType.assertType<Bag, { t: unknown; consequent: number; a: unknown }>(
      0,
    )
  })

  it('does not re-key when multiple inner captures exist', () => {
    type Inner = { a: Capture<'a'>; b: Capture<'b'> }
    type Pattern = { consequent: Sealed<Inner> }
    type Bag = ExtractCaptures<Pattern>
    AssertType.assertType<Bag, { a: unknown; b: unknown }>(0)
  })

  it('no-op re-key for zero inner captures', () => {
    type Inner = { literal: 1 }
    type Pattern = { consequent: Sealed<Inner> }
    type Bag = ExtractCaptures<Pattern>
    AssertType.assertType<Bag, {}>(0)
  })

  it('re-keys an inner single capture under each parent key of an If', () => {
    type Ret = {
      type: 'ReturnStatement'
      argument: Capture<'argument', unknown>
    }
    type Block = Sealed<{ type: 'BlockStatement'; body: readonly Ret[] }>
    type If = {
      type: 'IfStatement'
      test: Capture<'test', unknown>
      consequent: Block
      alternate: Block
    }
    type Bag = ExtractCaptures<If>
    AssertType.assertType<
      Bag,
      { test: unknown; consequent: unknown; alternate: unknown }
    >(0)
  })

  it("collides with no AST node data field named 'seal'", () => {
    type U = NodeByKind[keyof NodeByKind]
    type AllKeys = KeysOfUnion<U>
    type HasSeal = 'seal' extends AllKeys ? true : false
    AssertType.assertType<HasSeal, false>(0)
  })

  describe('gating', () => {
    it('resolves zero- and single-capture seal() to a zero-arg call', () => {
      type Zero = { type: 'X' }
      type One = { type: 'Y'; arg: Capture<'a', number> }
      type ZS = NodeWithSeal<Zero>
      type OS = NodeWithSeal<One>
      type ZeroSeal = ZS['seal'] extends () => unknown ? true : false
      type OneSeal = OS['seal'] extends () => unknown ? true : false
      AssertType.assertType<ZeroSeal, true>(0)
      AssertType.assertType<OneSeal, true>(0)
    })

    it('returns never in multi-capture contexts (causing type error)', () => {
      type Many = { type: 'Z'; a: Capture<'a'>; b: Capture<'b'> }
      type MS = NodeWithSeal<Many>
      type Ret = MS['seal'] extends () => infer R ? R : unknown
      AssertType.assertType<Ret, never>(0)
    })
  })
})
