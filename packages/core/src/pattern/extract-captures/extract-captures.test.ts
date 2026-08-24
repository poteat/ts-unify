import Capture from '@/capture'
import type { StringPredicate } from '@/string-predicate'
import AssertType from '@/test-utils/assert-type'

import type { ExtractCaptures } from './extract-captures'

describe('extract-captures', () => {
  it('reads an implicit value as unknown', () => {
    type TestBasic = ExtractCaptures<{ value: Capture.Capture<'v'> }>
    AssertType.assertType<TestBasic, { v: unknown }>(0)
  })

  it('gives a RegExp in a string position no capture', () => {
    type TestRegExp = ExtractCaptures<{
      value: Capture.Capture<'v'>
      name: RegExp
    }>
    AssertType.assertType<TestRegExp, { v: unknown }>(0)
  })

  it('gives a string predicate in a string position no capture', () => {
    type TestPredicate = ExtractCaptures<{
      value: Capture.Capture<'v'>
      name: StringPredicate
    }>
    AssertType.assertType<TestPredicate, { v: unknown }>(0)
  })

  it('collects several captures into one bag', () => {
    type TestMultiple = ExtractCaptures<{
      name: Capture.Capture<'n'>
      age: Capture.Capture<'a'>
    }>
    AssertType.assertType<TestMultiple, { n: unknown; a: unknown }>(0)
  })

  it('unifies one name captured twice', () => {
    type TestUnification1 = ExtractCaptures<{
      a: Capture.Capture<'x'>
      b: Capture.Capture<'x'>
    }>
    AssertType.assertType<TestUnification1, { x: unknown }>(0)
  })

  it('unifies one name captured at different depths', () => {
    type TestUnification2 = ExtractCaptures<{
      data: { value: Capture.Capture<'x'> }
      other: Capture.Capture<'x'>
    }>
    AssertType.assertType<TestUnification2, { x: unknown }>(0)
  })

  it('reaches captures in nested objects', () => {
    type TestNested = ExtractCaptures<{
      user: {
        id: Capture.Capture<'userId'>
        name: Capture.Capture<'userName'>
      }
    }>
    AssertType.assertType<TestNested, { userId: unknown; userName: unknown }>(0)
  })

  it('reaches captures in a tuple', () => {
    type TestArray = ExtractCaptures<
      [Capture.Capture<'first'>, Capture.Capture<'second'>]
    >
    AssertType.assertType<TestArray, { first: unknown; second: unknown }>(0)
  })

  it('reaches a capture in an optional position', () => {
    type TestOptional = ExtractCaptures<{ value?: Capture.Capture<'v'> }>
    AssertType.assertType<TestOptional, { v: unknown }>(0)
  })

  it('reaches a capture in a union with primitives', () => {
    type TestMixed = ExtractCaptures<{
      value: Capture.Capture<'v'> | string | number
    }>
    AssertType.assertType<TestMixed, { v: unknown }>(0)
  })

  it('leaves literal values out of the bag', () => {
    type TestMixedPattern = ExtractCaptures<{
      name: Capture.Capture<'n'>
      age: 25
      isActive: true
    }>
    AssertType.assertType<TestMixedPattern, { n: unknown }>(0)
  })

  it('collects captures across objects, literals and tuples', () => {
    type TestComplex = ExtractCaptures<{
      user: { id: Capture.Capture<'id'>; name: 'Alice' }
      selectedId: Capture.Capture<'id'>
      metadata: {
        tags: [Capture.Capture<'tag1'>, Capture.Capture<'tag2'>]
      }
    }>
    AssertType.assertType<
      TestComplex,
      { id: unknown; tag1: unknown; tag2: unknown }
    >(0)
  })

  it('keeps an explicit value type', () => {
    type TestTyped = ExtractCaptures<{ value: Capture.Capture<'v', number> }>
    AssertType.assertType<TestTyped, { v: number }>(0)
  })

  it('intersects the value types of one name captured twice', () => {
    type TestIntersect = ExtractCaptures<{
      a: Capture.Capture<'x', number>
      b: Capture.Capture<'x', string>
    }>
    AssertType.assertType<TestIntersect, { x: number & string }>(0)
  })

  it('treats {} as neutral (no captures) instead of never', () => {
    type Result = ExtractCaptures<{}>
    AssertType.assertType<Result, {}>(0)
  })

  it('extracts captures from a nested parent pattern', () => {
    type P = { parent: { id: Capture.$ } }
    type Bag = ExtractCaptures<P>
    type Expected = { id: unknown }
    AssertType.assertType<Bag, Expected>(0)
  })

  describe('implicit $', () => {
    it('should handle implicit captures with $ function', () => {
      type Pattern = { name: Capture.$; age: Capture.$ }
      type Result = ExtractCaptures<Pattern>
      AssertType.assertType<Result, { name: unknown; age: unknown }>(0)
    })

    it('should handle nested implicit captures', () => {
      type Pattern = { user: { id: Capture.$; name: Capture.$ } }
      type Result = ExtractCaptures<Pattern>
      AssertType.assertType<Result, { id: unknown; name: unknown }>(0)
    })

    it('should handle root-level $ (no captures extracted)', () => {
      type Pattern = Capture.$
      type Result = ExtractCaptures<Pattern>
      AssertType.assertType<Result, {}>(0)
    })

    it('should handle mixed implicit and explicit captures', () => {
      type Pattern = {
        id: Capture.Capture<'userId'>
        name: Capture.$
        age: Capture.$
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
            name: Capture.$
            age: Capture.$
          }
        }
      }
      type Result = ExtractCaptures<Pattern>
      AssertType.assertType<Result, { name: unknown; age: unknown }>(0)
    })

    it('should handle arrays with implicit captures', () => {
      type Pattern = [Capture.$, Capture.$, Capture.Capture<'third'>]
      type Result = ExtractCaptures<Pattern>
      AssertType.assertType<
        Result,
        { '0': unknown; '1': unknown; third: unknown }
      >(0)
    })

    it('should handle optional properties with implicit captures', () => {
      type Pattern = { name?: Capture.$; age: Capture.$ }
      type Result = ExtractCaptures<Pattern>
      AssertType.assertType<Result, { name: unknown; age: unknown }>(0)
    })

    it('should handle union types with implicit captures', () => {
      type Pattern = { value: Capture.$ | string | number }
      type Result = ExtractCaptures<Pattern>
      AssertType.assertType<Result, { value: unknown }>(0)
    })

    it('should handle same-named implicit captures', () => {
      type Pattern = { a: { x: Capture.$ }; b: { x: Capture.$ } }
      type Result = ExtractCaptures<Pattern>
      AssertType.assertType<Result, { x: unknown }>(0)
    })

    it('should handle multiple occurrences of same implicit capture', () => {
      type Pattern = {
        first: { value: Capture.$ }
        second: { value: Capture.$ }
        third: Capture.Capture<'value'>
      }
      type Result = ExtractCaptures<Pattern>
      AssertType.assertType<Result, { value: unknown }>(0)
    })
  })

  describe('spread tokens', () => {
    it('extracts spread as readonly array of its element type', () => {
      type Pattern = ['x', Capture.Spread<'rest', number>, 'y']
      type Result = ExtractCaptures<Pattern>
      AssertType.assertType<Result, { rest: ReadonlyArray<number> }>(0)
    })

    it('intersects duplicate spread names across pattern', () => {
      type Pattern = [
        Capture.Spread<'xs', string>,
        Capture.Spread<'xs', string | number>,
      ]
      type Result = ExtractCaptures<Pattern>
      AssertType.assertType<
        Result,
        { xs: ReadonlyArray<string> & ReadonlyArray<string | number> }
      >(0)
    })

    it('re-keys anonymous spread to the containing property key', () => {
      type Pattern = {
        body: readonly [Capture.Spread<''>, Capture.Capture<'x', number>]
      }
      type R = ExtractCaptures<Pattern>
      type Expected = { body: ReadonlyArray<unknown>; x: number }
      AssertType.assertType<R, Expected>(0)
    })
  })
})
