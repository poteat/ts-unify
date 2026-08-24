import { expectType } from './expect-type'

const obj = { mode: 'production' } as const

const value: string | number = 'hello'

describe('expectType', () => {
  test('exact type matches pass', () => {
    // Primitives
    expectType('hello').toBe('hello')
    expectType(42).toBe(42)
    expectType(true).toBe(true)

    // Objects (reference equality with toBe)
    const obj = { a: 'test' }
    expectType(obj).toBe(obj)

    // Arrays
    const arr = ['a', 'b', 'c']
    expectType(arr).toBe(arr)

    // Special values
    expectType(null).toBe(null)
    expectType(undefined).toBe(undefined)
  })

  test('returns the expected value', () => {
    expect(expectType('hello').toBe('hello')).toBe('hello')
    expect(expectType(42).toBe(42)).toBe(42)
  })

  test('works with const assertions', () => {
    expectType('hello' as const).toBe('hello')
    expectType(42 as const).toBe(42)
    expectType(obj.mode).toBe('production')
  })

  test('works with union types', () => {
    // Type is string | number, so it must match exactly
    expectType(value).toBe(value)
  })

  test('works with generic functions', () => {
    function identity<T>(x: T): T {
      expectType(x).toBe(x)

      return x
    }

    expectType(identity('test')).toBe('test')
    expectType(identity(42)).toBe(42)
  })

  test('works with type narrowing', () => {
    const value: string | number = 'hello'

    if (typeof value === 'string') {
      // Type is narrowed to string
      expectType(value).toBe(value) // Both are string type
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
