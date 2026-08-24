import BuilderMap from '@/ast/builder-map'
import Capture from '@/capture'
import type { Spread } from '@/capture'
import CaptureSpread from '@/capture/spread'

import type { Pattern } from '.'

describe('Pattern type', () => {
  it('accepts original shape', () => {
    type Shape = { x: number; y: { z: string }; tup: [number, string] }
    const p: Pattern<Shape> = {
      x: 1,
      y: { z: 'a' },
      tup: [1, 'b'],
    }
    expect(typeof p).toBe('object')
  })

  it('accepts implicit placeholders', () => {
    type Shape = { x: number; y: { z: string }; tup: [number, string] }
    const p: Pattern<Shape> = {
      x: Capture.$,
      y: { z: Capture.$ },
      tup: [Capture.$, Capture.$],
    }
    expect(typeof p).toBe('object')
  })

  it('accepts spread token in sequence position (type-level)', () => {
    type Shape = readonly number[]

    const p: Pattern<Shape> = [
      {
        [CaptureSpread.SPREAD_BRAND]: true,
        name: 'rest',
      } satisfies Spread<'rest', number>,
    ]

    expect(Array.isArray(p)).toBe(true)
  })

  it('accepts a RegExp in a string position only', () => {
    type Shape = { x: number; y: { z: string } }
    const p: Pattern<Shape> = { y: { z: /^a/ } }
    // @ts-expect-error a number position takes no RegExp
    const bad: Pattern<Shape> = { x: /1/ }
    expect(typeof p).toBe('object')
    expect(typeof bad).toBe('object')
  })

  it('accepts a string predicate in a string position only', () => {
    type Shape = { x: number; y: { z: string } }
    const p: Pattern<Shape> = { y: { z: BuilderMap.U.string.reserved() } }
    const q: Pattern<Shape> = {
      y: { z: BuilderMap.U.string.not(BuilderMap.U.string.identifierName()) },
    }
    // @ts-expect-error a number position takes no predicate
    const bad: Pattern<Shape> = { x: BuilderMap.U.string.reserved() }
    // @ts-expect-error a bare function is not a predicate
    const bare: Pattern<Shape> = { y: { z: (s: string) => s.length > 1 } }
    expect(typeof p).toBe('object')
    expect(typeof q).toBe('object')
    expect(typeof bad).toBe('object')
    expect(typeof bare).toBe('object')
  })

  it('accepts explicit captures', () => {
    type Shape = { x: number; y: string; tup: [number, string] }
    const p: Pattern<Shape> = {
      x: Capture.$('x'),
      y: Capture.$('y'),
      tup: [Capture.$('0'), Capture.$('1')],
    }
    expect(typeof p).toBe('object')
  })

  it('allows omitting object keys (loose patterns)', () => {
    type Shape = { id: number; user: { name: string; active: boolean } }
    const p1: Pattern<Shape> = { id: Capture.$('id') }
    const p2: Pattern<Shape> = { user: { name: Capture.$ } }
    expect(typeof p1).toBe('object')
    expect(typeof p2).toBe('object')
  })

  it('rejects extra keys not in the shape', () => {
    type Shape = { id: number }
    // @ts-expect-error - extra property not in Shape
    const bad: Pattern<Shape> = { id: Capture.$('id'), extra: true }
    void bad
    expect(true).toBe(true)
  })
})
