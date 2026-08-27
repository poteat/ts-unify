import BuilderMap from '@/ast/builder-map'
import Capture from '@/capture'
import Spread from '@/capture/spread'

import type { Pattern } from '.'

const accepted = <Shape>(pattern: Pattern<Shape>) => pattern

describe('pattern', () => {
  it('accepts original shape', () => {
    type Shape = { x: number; y: { z: string }; tup: [number, string] }
    expect(typeof accepted<Shape>({ x: 1, y: { z: 'a' }, tup: [1, 'b'] })).toBe(
      'object',
    )
  })

  it('accepts implicit placeholders', () => {
    type Shape = { x: number; y: { z: string }; tup: [number, string] }
    expect(
      typeof accepted<Shape>({
        x: Capture.$,
        y: { z: Capture.$ },
        tup: [Capture.$, Capture.$],
      }),
    ).toBe('object')
  })

  it('accepts spread token in sequence position (type-level)', () => {
    type Shape = readonly number[]

    expect(
      Array.isArray(
        accepted<Shape>([
          {
            [Spread.SPREAD_BRAND]: true,
            name: 'rest',
          } satisfies Spread.Spread<'rest', number>,
        ]),
      ),
    ).toBe(true)
  })

  it('accepts a RegExp in a string position only', () => {
    type Shape = { x: number; y: { z: string } }
    const p = accepted<Shape>({ y: { z: /^a/ } })
    // @ts-expect-error a number position takes no RegExp
    const bad = accepted<Shape>({ x: /1/ })
    expect(typeof p).toBe('object')
    expect(typeof bad).toBe('object')
  })

  it('accepts a string predicate in a string position only', () => {
    type Shape = { x: number; y: { z: string } }
    const p = accepted<Shape>({ y: { z: BuilderMap.U.string.reserved() } })
    const q = accepted<Shape>({
      y: { z: BuilderMap.U.string.not(BuilderMap.U.string.identifierName()) },
    })
    // @ts-expect-error a number position takes no predicate
    const bad = accepted<Shape>({ x: BuilderMap.U.string.reserved() })
    // @ts-expect-error a bare function is not a predicate
    const bare = accepted<Shape>({ y: { z: (s: string) => s.length > 1 } })
    expect(typeof p).toBe('object')
    expect(typeof q).toBe('object')
    expect(typeof bad).toBe('object')
    expect(typeof bare).toBe('object')
  })

  it('accepts explicit captures', () => {
    type Shape = { x: number; y: string; tup: [number, string] }
    expect(
      typeof accepted<Shape>({
        x: Capture.$('x'),
        y: Capture.$('y'),
        tup: [Capture.$('0'), Capture.$('1')],
      }),
    ).toBe('object')
  })

  it('allows omitting object keys (loose patterns)', () => {
    type Shape = { id: number; user: { name: string; isActive: boolean } }
    expect(typeof accepted<Shape>({ id: Capture.$('id') })).toBe('object')
    expect(typeof accepted<Shape>({ user: { name: Capture.$ } })).toBe('object')
  })

  it('rejects extra keys not in the shape', () => {
    type Shape = { id: number }
    // @ts-expect-error an extra property not in Shape
    void accepted<Shape>({ id: Capture.$('id'), isExtra: true })
    expect(true).toBe(true)
  })
})
