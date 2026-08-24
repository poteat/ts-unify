import type { BindCaptures } from '@/capture/bind-captures/bind-captures'
import type { Capture } from '@/capture/capture-type'
import Dollar from '@/capture/dollar'
import type { Spread } from '@/capture/spread'
import type { Pattern } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

describe('bind-sequence', () => {
  it('binds head/rest/tail with element-type refinement', () => {
    type Shape = ReadonlyArray<string | number>
    type Pattern = [Capture<'head'>, Spread<'rest'>, Capture<'tail'>]
    type Result = BindCaptures<Pattern, Shape>
    type Expected = readonly [
      Capture<'head', string | number>,
      Spread<'rest', string | number>,
      Capture<'tail', string | number>,
    ]
    AssertType.assertType<Result, Expected>(0)
  })

  it('intersects typed spread element with shape element type', () => {
    type Shape = ReadonlyArray<string | number>
    type Pattern = [Spread<'xs', string>]
    type Result = BindCaptures<Pattern, Shape>
    type Expected = readonly [Spread<'xs', string>]
    AssertType.assertType<Result, Expected>(0)
  })

  it('refines the element of each of several spreads', () => {
    type Shape = ReadonlyArray<boolean>
    type Pattern = [Spread<'a'>, 'x', Spread<'b'>]
    type Result = BindCaptures<Pattern, Shape>
    type Expected = readonly [Spread<'a', boolean>, 'x', Spread<'b', boolean>]
    AssertType.assertType<Result, Expected>(0)
  })

  it('binds spread yielded by $ sugar', () => {
    const seq = [...Dollar.$<'rest', string>('rest')]
    type Elem = (typeof seq)[number]
    type Shape = ReadonlyArray<string | number>
    type Bound = BindCaptures<Elem, Shape>
    type Expected = Spread<'rest', string>
    AssertType.assertType<Bound, Expected>(0)
  })

  it("builder accepts $, ...$('rest') and binds to value types", () => {
    type Shape = ReadonlyArray<string | number>

    function build<const P extends Pattern<Shape>>(
      p: P,
    ): BindCaptures<P, Shape> {
      void p

      return 0 as unknown as BindCaptures<P, Shape>
    }

    const bound = build([Dollar.$, ...Dollar.$('rest')])
    type Bound = typeof bound
    type Expected = readonly [
      Capture<'0', string | number>,
      ...Spread<'rest', string | number>[],
    ]
    AssertType.assertType<Bound, Expected>(0)
  })

  it('binds an anonymous $ spread in a property to the property key', () => {
    type Shape = { body: ReadonlyArray<string | number> }
    type Pattern = { body: readonly [Spread<''>, 'x'] }
    type Result = BindCaptures<Pattern, Shape>
    type Expected = {
      readonly body: readonly [Spread<'body', string | number>, 'x']
    }
    AssertType.assertType<Result, Expected>(0)
  })
})
