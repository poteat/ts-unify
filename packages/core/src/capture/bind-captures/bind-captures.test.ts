import type { Capture } from '@/capture/capture-type'
import type { $ } from '@/capture/dollar'
import type { StringPredicate } from '@/string-predicate'
import AssertType from '@/test-utils/assert-type'

import type { BindCaptures } from './bind-captures'

describe('bind-captures', () => {
  it('binds implicit $ to named captures based on shape', () => {
    type Shape = { id: number; name: string; nested: { isOn: boolean } }
    type Pattern = {
      id: $
      name: 'Alice'
      nested: { isOn: $ }
    }
    type Result = BindCaptures<Pattern, Shape>
    type Expected = {
      readonly id: Capture<'id', number>
      readonly name: 'Alice'
      readonly nested: { readonly isOn: Capture<'isOn', boolean> }
    }
    AssertType.assertType<Result, Expected>(0)
  })

  it('leaves a RegExp in a string position as is, with no capture', () => {
    type Shape = { id: number; name: string }
    type Pattern = { id: $; name: RegExp }
    type Result = BindCaptures<Pattern, Shape>
    type Expected = {
      readonly id: Capture<'id', number>
      readonly name: RegExp
    }
    AssertType.assertType<Result, Expected>(0)
  })

  it('leaves a string predicate in a string position as is', () => {
    type Shape = { id: number; name: string }
    type Pattern = { id: $; name: StringPredicate }
    type Result = BindCaptures<Pattern, Shape>
    type Expected = {
      readonly id: Capture<'id', number>
      readonly name: StringPredicate
    }
    AssertType.assertType<Result, Expected>(0)
  })

  it('preserves explicit capture and upgrades unknown to shape type', () => {
    type Shape = { value: number; text: string }
    type Pattern1 = {
      value: Capture<'v', number>
      text: Capture<'t', unknown>
    }
    type Result1 = BindCaptures<Pattern1, Shape>
    type Expected1 = {
      readonly value: Capture<'v', number>
      readonly text: Capture<'t', string>
    }
    AssertType.assertType<Result1, Expected1>(0)
  })

  it('allows explicit captures anywhere in the pattern', () => {
    type Shape = { a: number; b: { c: string } }
    type Pattern = { a: Capture<'x', unknown>; b: { c: $ } }
    type Result = BindCaptures<Pattern, Shape>
    type Expected = {
      readonly a: Capture<'x', number>
      readonly b: { readonly c: Capture<'c', string> }
    }
    AssertType.assertType<Result, Expected>(0)
  })

  it('binds root-level $ across object shape', () => {
    type Shape = { a: number; b: string }
    type Pattern = $
    type Result = BindCaptures<Pattern, Shape>
    type Expected = {
      readonly a: Capture<'a', number>
      readonly b: Capture<'b', string>
    }
    AssertType.assertType<Result, Expected>(0)
  })

  it('binds root-level $ across tuple shape', () => {
    type Shape = [number, string]
    type Pattern = $
    type Result = BindCaptures<Pattern, Shape>
    type Expected = readonly [Capture<'0', number>, Capture<'1', string>]
    AssertType.assertType<Result, Expected>(0)
  })

  it('binds root-level $ across array shape', () => {
    type Shape = string[]
    type Pattern = $
    type Result = BindCaptures<Pattern, Shape>
    type Expected = readonly Capture<`${number}`, string>[]
    AssertType.assertType<Result, Expected>(0)
  })
})
