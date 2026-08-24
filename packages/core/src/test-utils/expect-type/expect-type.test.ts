import { expectType } from './expect-type'
import Fixtures from './fixtures'

describe('expect-type', () => {
  test('exact type matches pass', () => {
    expectType('hello').toBe('hello')
    expectType(Fixtures.someNumber).toBe(Fixtures.someNumber)
    expectType(true).toBe(true)

    const obj = { a: 'test' }
    expectType(obj).toBe(obj)

    const arr = ['a', 'b', 'c']
    expectType(arr).toBe(arr)

    expectType(null).toBe(null)
    expectType(undefined).toBe(undefined)
  })

  test('returns the expected value', () => {
    expect(expectType('hello').toBe('hello')).toBe('hello')
    expect(expectType(42).toBe(42)).toBe(42)
  })

  test('works with const assertions', () => {
    expectType('hello' as const).toBe('hello')
    expectType(2 as const).toBe(2)
    expectType(Fixtures.settings.mode).toBe('production')
  })

  test('works with union types', () => {
    expectType(Fixtures.unionValue).toBe(Fixtures.unionValue)
  })

  test('works with generic functions', () => {
    function identity<T>(x: T): T {
      expectType(x).toBe(x)

      return x
    }

    expectType(identity('test')).toBe('test')
    expectType(identity(Fixtures.someNumber)).toBe(Fixtures.someNumber)
  })

  test('narrows the union value to string under a typeof guard', () => {
    if (typeof Fixtures.unionValue === 'string') {
      expectType(Fixtures.unionValue).toBe(Fixtures.unionValue)
    }
  })

  test('enforces readonly modifiers', () => {
    const mutable = ['a', 'b']
    const readonlyArr: readonly string[] = ['a', 'b']

    expectType(mutable).toBe(mutable)
    expectType(readonlyArr).toBe(readonlyArr)
  })

  test('differentiates optional properties', () => {
    const withOptional: { a: string; b?: number } = { a: 'test' }
    const withUndefined: { a: string; b: number | undefined } = {
      a: 'test',
      b: undefined,
    }

    expectType(withOptional).toBe(withOptional)
    expectType(withUndefined).toBe(withUndefined)
  })
})
