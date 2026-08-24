import type { TSESTree } from '@typescript-eslint/types'

import type { BindCaptures } from '@/capture/bind-captures'
import type { Capture } from '@/capture/capture-type'
import AssertType from '@/test-utils/assert-type'

import type { FluentCapture } from './fluent-capture'

/**
 * Number handed to `.default()` as the fallback, so the bound value type
 * reads as the union of the base and the fallback.
 */
const FALLBACK = 123 as const

describe('fluent-capture', () => {
  it('map replaces the capture value type (normalized) after binding', () => {
    function check(capture: FluentCapture<'x', number>) {
      const c = capture.map((n: number) => n.toString())
      type Bound = BindCaptures<typeof c, number>
      type V = Bound extends { value?: () => infer T } ? T : never
      AssertType.assertType<V, string>(0)
    }

    void check
  })

  it('default coalesces falsy to fallback (union with base)', () => {
    function check(capture: FluentCapture<'y', string>) {
      const c = capture.default(FALLBACK)
      type Bound = BindCaptures<typeof c, string>
      type V = Bound extends { value?: () => infer T } ? T : never
      AssertType.assertType<V, string | 123>(0)
    }

    void check
  })

  it('defaultUndefined adds Identifier to the value type after binding', () => {
    function check(capture: FluentCapture<'z', string>) {
      const c = capture.defaultUndefined()
      type Bound = BindCaptures<typeof c, string>
      type V = Bound extends { value?: () => infer T } ? T : never
      AssertType.assertType<V, string | TSESTree.Identifier>(0)
    }

    void check
  })

  it('truthy narrows out falsy constituents after binding', () => {
    function check(capture: FluentCapture<'t', string | '' | 0 | null>) {
      const c = capture.truthy()
      type Bound = BindCaptures<typeof c, string | '' | 0 | null>
      type V = Bound extends { value?: () => infer T } ? T : never
      AssertType.assertType<V, string>(0)
    }

    void check
  })

  it('when(guard) narrows to the guarded subtype after binding', () => {
    function check(capture: FluentCapture<'a', string | null>) {
      const c = capture.when((x: string | null): x is string => x !== null)
      type Bound = BindCaptures<typeof c, string | null>
      type V = Bound extends { value?: () => infer T } ? T : never
      AssertType.assertType<V, string>(0)
    }

    void check
  })

  it('when(boolean) leaves the type unchanged after binding', () => {
    function check(capture: FluentCapture<'b', string | null>) {
      const c = capture.when((x: string | null): boolean => x !== null)
      type Bound = BindCaptures<typeof c, string | null>
      type V = Bound extends { value?: () => infer T } ? T : never
      AssertType.assertType<V, string | null>(0)
    }

    void check
  })

  it('methods are chainable, and default + truthy + when leave string', () => {
    function check(capture: FluentCapture<'c', string | ''>) {
      const c = capture
        .default('x')
        .truthy()
        .when((s: string): s is `${string}${string}` => s !== '')
      type V = typeof c extends { value?: () => infer T } ? T : never
      AssertType.assertType<V, string>(0)
    }

    void check
  })

  it('still conforms to Capture<Name, Value>', () => {
    function check(c: FluentCapture<'k', number>) {
      const assign: Capture<'k', number> = c
      void assign
    }

    void check
  })
})
