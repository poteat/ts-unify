import SrcCapture from '@/capture'
import type { $, Capture, Spread } from '@/capture'
import type { StringPredicate } from '@/string-predicate'
import AssertType from '@/test-utils/assert-type'

import type { ExtractCaptures } from './extract-captures'

describe('extract-captures', () => {
  it('reads an implicit value as unknown', () => {
    type TestBasic = ExtractCaptures<{ value: Capture<'v'> }>
    AssertType.assertType<TestBasic, { v: unknown }>(0)
  })

  it('gives a RegExp in a string position no capture', () => {
    type TestRegExp = ExtractCaptures<{ value: Capture<'v'>; name: RegExp }>
    AssertType.assertType<TestRegExp, { v: unknown }>(0)
  })

  it('gives a string predicate in a string position no capture', () => {
    type TestPredicate = ExtractCaptures<{
      value: Capture<'v'>
      name: StringPredicate
    }>
    AssertType.assertType<TestPredicate, { v: unknown }>(0)
  })

  it('collects several captures into one bag', () => {
    type TestMultiple = ExtractCaptures<{
      name: Capture<'n'>
      age: Capture<'a'>
    }>
    AssertType.assertType<TestMultiple, { n: unknown; a: unknown }>(0)
  })

  it('unifies one name captured twice', () => {
    type TestUnification1 = ExtractCaptures<{
      a: Capture<'x'>
      b: Capture<'x'>
    }>
    AssertType.assertType<TestUnification1, { x: unknown }>(0)
  })

  it('unifies one name captured at different depths', () => {
    type TestUnification2 = ExtractCaptures<{
      data: { value: Capture<'x'> }
      other: Capture<'x'>
    }>
    AssertType.assertType<TestUnification2, { x: unknown }>(0)
  })

  it('reaches captures in nested objects', () => {
    type TestNested = ExtractCaptures<{
      user: {
        id: Capture<'userId'>
        name: Capture<'userName'>
      }
    }>
    AssertType.assertType<TestNested, { userId: unknown; userName: unknown }>(0)
  })

  it('reaches captures in a tuple', () => {
    type TestArray = ExtractCaptures<[Capture<'first'>, Capture<'second'>]>
    AssertType.assertType<TestArray, { first: unknown; second: unknown }>(0)
  })

  it('reaches a capture in an optional position', () => {
    type TestOptional = ExtractCaptures<{ value?: Capture<'v'> }>
    AssertType.assertType<TestOptional, { v: unknown }>(0)
  })

  it('reaches a capture in a union with primitives', () => {
    type TestMixed = ExtractCaptures<{
      value: Capture<'v'> | string | number
    }>
    AssertType.assertType<TestMixed, { v: unknown }>(0)
  })

  it('leaves literal values out of the bag', () => {
    type TestMixedPattern = ExtractCaptures<{
      name: Capture<'n'>
      age: 25
      isActive: true
    }>
    AssertType.assertType<TestMixedPattern, { n: unknown }>(0)
  })

  it('collects captures across objects, literals and tuples', () => {
    type TestComplex = ExtractCaptures<{
      user: { id: Capture<'id'>; name: 'Alice' }
      selectedId: Capture<'id'>
      metadata: {
        tags: [Capture<'tag1'>, Capture<'tag2'>]
      }
    }>
    AssertType.assertType<
      TestComplex,
      { id: unknown; tag1: unknown; tag2: unknown }
    >(0)
  })

  it('keeps an explicit value type', () => {
    type TestTyped = ExtractCaptures<{ value: Capture<'v', number> }>
    AssertType.assertType<TestTyped, { v: number }>(0)
  })

  it('intersects the value types of one name captured twice', () => {
    type TestIntersect = ExtractCaptures<{
      a: Capture<'x', number>
      b: Capture<'x', string>
    }>
    AssertType.assertType<TestIntersect, { x: number & string }>(0)
  })

  it('treats {} as neutral (no captures) instead of never', () => {
    type Result = ExtractCaptures<{}>
    AssertType.assertType<Result, {}>(0)
  })

  it('extracts captures from a nested parent pattern', () => {
    type P = { parent: { id: $ } }
    type Bag = ExtractCaptures<P>
    type Expected = { id: unknown }
    AssertType.assertType<Bag, Expected>(0)
  })

  describe('implicit $', () => {
    it('should handle implicit captures with $ function', () => {
      type Pattern = { name: SrcCapture.$; age: SrcCapture.$ }
      type Result = ExtractCaptures<Pattern>
      AssertType.assertType<Result, { name: unknown; age: unknown }>(0)
    })

    it('should handle nested implicit captures', () => {
      type Pattern = { user: { id: SrcCapture.$; name: SrcCapture.$ } }
      type Result = ExtractCaptures<Pattern>
      AssertType.assertType<Result, { id: unknown; name: unknown }>(0)
    })

    it('should handle root-level $ (no captures extracted)', () => {
      type Pattern = SrcCapture.$
      type Result = ExtractCaptures<Pattern>
      AssertType.assertType<Result, {}>(0)
    })

    it('should handle mixed implicit and explicit captures', () => {
      type Pattern = {
        id: Capture<'userId'>
        name: SrcCapture.$
        age: SrcCapture.$
      }
      type Result = ExtractCaptures<Pattern>
      AssertType.assertType<
        Result,
        { userId: unknown; name: unknown; age: unknown }
      >(0)
    })

    it('should handle deeply nested implicit captures', () => {
      type Pattern = {
        user: {
          profile: {
            name: SrcCapture.$
            age: SrcCapture.$
          }
        }
      }
      type Result = ExtractCaptures<Pattern>
      AssertType.assertType<Result, { name: unknown; age: unknown }>(0)
    })

    it('should handle arrays with implicit captures', () => {
      type Pattern = [SrcCapture.$, SrcCapture.$, Capture<'third'>]
      type Result = ExtractCaptures<Pattern>
      AssertType.assertType<
        Result,
        { '0': unknown; '1': unknown; third: unknown }
      >(0)
    })

    it('should handle optional properties with implicit captures', () => {
      type Pattern = { name?: SrcCapture.$; age: SrcCapture.$ }
      type Result = ExtractCaptures<Pattern>
      AssertType.assertType<Result, { name: unknown; age: unknown }>(0)
    })

    it('should handle union types with implicit captures', () => {
      type Pattern = { value: SrcCapture.$ | string | number }
      type Result = ExtractCaptures<Pattern>
      AssertType.assertType<Result, { value: unknown }>(0)
    })

    it('should handle same-named implicit captures', () => {
      type Pattern = { a: { x: SrcCapture.$ }; b: { x: SrcCapture.$ } }
      type Result = ExtractCaptures<Pattern>
      AssertType.assertType<Result, { x: unknown }>(0)
    })

    it('should handle multiple occurrences of same implicit capture', () => {
      type Pattern = {
        first: { value: SrcCapture.$ }
        second: { value: SrcCapture.$ }
        third: Capture<'value'>
      }
      type Result = ExtractCaptures<Pattern>
      AssertType.assertType<Result, { value: unknown }>(0)
    })
  })

  describe('spread tokens', () => {
    it('extracts spread as readonly array of its element type', () => {
      type Pattern = ['x', Spread<'rest', number>, 'y']
      type Result = ExtractCaptures<Pattern>
      AssertType.assertType<Result, { rest: ReadonlyArray<number> }>(0)
    })

    it('intersects duplicate spread names across pattern', () => {
      type Pattern = [Spread<'xs', string>, Spread<'xs', string | number>]
      type Result = ExtractCaptures<Pattern>
      AssertType.assertType<
        Result,
        { xs: ReadonlyArray<string> & ReadonlyArray<string | number> }
      >(0)
    })

    it('re-keys anonymous spread to the containing property key', () => {
      type Pattern = { body: readonly [Spread<''>, Capture<'x', number>] }
      type R = ExtractCaptures<Pattern>
      type Expected = { body: ReadonlyArray<unknown>; x: number }
      AssertType.assertType<R, Expected>(0)
    })
  })
})
