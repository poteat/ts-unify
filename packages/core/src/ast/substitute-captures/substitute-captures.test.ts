import type { Sealed } from '@/ast/sealed'
import type { Capture } from '@/capture/capture-type'
import type { Spread } from '@/capture/spread/spread'
import AssertType from '@/test-utils/assert-type'

import type { SubstituteCaptures } from './substitute-captures'

describe('SubstituteCaptures (type-level)', () => {
  it('refines an explicit capture with a bag value', () => {
    type Node = { type: 'ReturnStatement'; argument: Capture<'arg', unknown> }
    type Bag = { arg: string }
    type Result = SubstituteCaptures<Node, Bag>
    type ArgCapture = Result['argument']
    AssertType.assertType<ArgCapture, Capture<'arg', string>>(0)
  })

  it('leaves captures unchanged when name is not in bag', () => {
    type Node = { x: Capture<'x', unknown> }
    type Bag = { y: number }
    type Result = SubstituteCaptures<Node, Bag>
    AssertType.assertType<Result['x'], Capture<'x', unknown>>(0)
  })

  it('refines spread capture element type from bag', () => {
    type Node = [string, Spread<'rest', unknown>]
    type Bag = { rest: ReadonlyArray<number> }
    type Result = SubstituteCaptures<Node, Bag>
    AssertType.assertType<Result, Readonly<[string, Spread<'rest', number>]>>(0)
  })

  it('preserves Sealed wrapper while transforming inner', () => {
    type Node = Sealed<{ argument: Capture<'arg', unknown> }>
    type Bag = { arg: boolean }
    type Result = SubstituteCaptures<Node, Bag>
    AssertType.assertType<
      Result,
      Sealed<{ argument: Capture<'arg', boolean> }>
    >(0)
  })

  it('recurses through nested objects', () => {
    type Node = {
      outer: {
        inner: Capture<'v', unknown>
      }
    }
    type Bag = { v: number }
    type Result = SubstituteCaptures<Node, Bag>
    AssertType.assertType<Result['outer']['inner'], Capture<'v', number>>(0)
  })

  it('passes through primitives unchanged', () => {
    type Result = SubstituteCaptures<42, { x: string }>
    AssertType.assertType<Result, 42>(0)
  })
})
