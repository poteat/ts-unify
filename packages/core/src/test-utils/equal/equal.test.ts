import AssertType from '@/test-utils/assert-type'

import type { Equal } from './equal'

describe('Equal type tests', () => {
  test('exact matches return true', () => {
    // Primitives
    type StringString = Equal<string, string>
    AssertType.assertType<StringString, true>(0)

    type NumberNumber = Equal<number, number>
    AssertType.assertType<NumberNumber, true>(0)

    type BooleanBoolean = Equal<boolean, boolean>
    AssertType.assertType<BooleanBoolean, true>(0)

    // Literals
    type Literal42 = Equal<42, 42>
    AssertType.assertType<Literal42, true>(0)

    type LiteralHello = Equal<'hello', 'hello'>
    AssertType.assertType<LiteralHello, true>(0)

    type LiteralTrue = Equal<true, true>
    AssertType.assertType<LiteralTrue, true>(0)

    // Objects
    type SimpleObject = Equal<{ a: string }, { a: string }>
    AssertType.assertType<SimpleObject, true>(0)

    type NestedObject = Equal<{ a: { b: number } }, { a: { b: number } }>
    AssertType.assertType<NestedObject, true>(0)

    // Arrays and tuples
    type ArrayArray = Equal<string[], string[]>
    AssertType.assertType<ArrayArray, true>(0)

    type TupleTuple = Equal<[string, number], [string, number]>
    AssertType.assertType<TupleTuple, true>(0)

    // Special types
    type AnyAny = Equal<any, any>
    AssertType.assertType<AnyAny, true>(0)

    type UnknownUnknown = Equal<unknown, unknown>
    AssertType.assertType<UnknownUnknown, true>(0)

    type NeverNever = Equal<never, never>
    AssertType.assertType<NeverNever, true>(0)

    expect(true).toBe(true)
  })

  test('different types return false', () => {
    // Different primitives
    type StringNumber = Equal<string, number>
    AssertType.assertType<StringNumber, false>(0)

    type NumberBoolean = Equal<number, boolean>
    AssertType.assertType<NumberBoolean, false>(0)

    // Literal vs base type
    type LiteralVsBase = Equal<'hello', string>
    AssertType.assertType<LiteralVsBase, false>(0)

    type NumberLiteralVsNumber = Equal<42, number>
    AssertType.assertType<NumberLiteralVsNumber, false>(0)

    // Subtype relationships
    type SubtypeString = Equal<'a' | 'b', string>
    AssertType.assertType<SubtypeString, false>(0)

    // Different object shapes
    type DifferentObjects = Equal<{ a: string }, { a: string; b: number }>
    AssertType.assertType<DifferentObjects, false>(0)

    type OptionalProperty = Equal<{ a: string }, { a: string; b?: number }>
    AssertType.assertType<OptionalProperty, false>(0)

    // Array vs tuple
    type ArrayVsTuple = Equal<string[], [string, string]>
    AssertType.assertType<ArrayVsTuple, false>(0)

    // Union types
    type UnionVsSingle = Equal<string | number, string>
    AssertType.assertType<UnionVsSingle, false>(0)

    // Special type comparisons
    type AnyVsUnknown = Equal<any, unknown>
    AssertType.assertType<AnyVsUnknown, false>(0)

    type AnyVsString = Equal<any, string>
    AssertType.assertType<AnyVsString, false>(0)

    type UnknownVsString = Equal<unknown, string>
    AssertType.assertType<UnknownVsString, false>(0)

    expect(true).toBe(true)
  })

  test('readonly and modifiers', () => {
    // Readonly modifier matters
    type ReadonlyVsMutable = Equal<{ readonly a: string }, { a: string }>
    AssertType.assertType<ReadonlyVsMutable, false>(0)

    type ReadonlyArrayVsMutable = Equal<readonly string[], string[]>
    AssertType.assertType<ReadonlyArrayVsMutable, false>(0)

    // Optional modifier matters
    type OptionalVsRequired = Equal<{ a?: string }, { a: string }>
    AssertType.assertType<OptionalVsRequired, false>(0)

    type OptionalVsUndefined = Equal<{ a?: string }, { a: string | undefined }>
    AssertType.assertType<OptionalVsUndefined, false>(0)

    expect(true).toBe(true)
  })

  test('function types', () => {
    // Same function signatures
    type SameFunctions = Equal<(a: string) => number, (a: string) => number>
    AssertType.assertType<SameFunctions, true>(0)

    // Different parameter types
    type DifferentParams = Equal<(a: string) => number, (a: number) => number>
    AssertType.assertType<DifferentParams, false>(0)

    // Different return types
    type DifferentReturns = Equal<(a: string) => number, (a: string) => string>
    AssertType.assertType<DifferentReturns, false>(0)

    // Different parameter counts
    type DifferentArity = Equal<
      (a: string) => number,
      (a: string, b: number) => number
    >
    AssertType.assertType<DifferentArity, false>(0)

    expect(true).toBe(true)
  })
})
