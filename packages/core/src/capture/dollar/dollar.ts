import CaptureType from '@/capture/capture-type'
import type { DollarObjectSpread } from '@/capture/dollar-spread'
import type { FluentCapture, FluentOps } from '@/capture/fluent-capture'
import type { Spread } from '@/capture/spread'

import Util from './util'

/**
 * Type of the `$` sentinel: a call makes a named capture; the bare value
 * spreads into a sequence or an object pattern and carries the fluent ops.
 */
export interface $
  extends
    DollarObjectSpread,
    Iterable<Spread<'', unknown>>,
    FluentOps<$, unknown> {
  <const Name extends string>(
    name: Name,
  ): CaptureType.Capture<Name, unknown> &
    Iterable<Spread<Name, unknown>> &
    DollarObjectSpread &
    FluentCapture<Name, unknown>
  <const Name extends string, Value>(
    name: Name,
  ): CaptureType.Capture<Name, Value> &
    Iterable<Spread<Name, Value>> &
    DollarObjectSpread &
    FluentCapture<Name, Value>
}

/**
 * Create a capture sentinel with a literal-typed name.
 *
 * The bare `$` is an implicit sentinel too (`typeof $` in types): the
 * binders derive its name from the containing key or tuple index. The
 * token is frozen and iterates once, yielding a spread of the same name.
 *
 * @typeParam Name literal capture name inferred from the string
 * @typeParam Value associated value type
 * @param name unique identifier of the capture
 * @example
 * const a = $("id");                 // Capture<"id", unknown>
 * const b = $<"id", number>("id");    // Capture<"id", number>
 */
export const $ = (<const Name extends string, Value = unknown>(name: Name) => {
  const obj = {
    [CaptureType.CAPTURE_BRAND]: true,
    name,
  } as unknown as CaptureType.Capture<Name, Value> &
    Iterable<Spread<Name, Value>>
  Util.defineSpreadIterator<Name, Value>(obj, name)

  return Object.freeze(obj)
}) as unknown as $

Util.defineSpreadIterator<'', unknown>($, '')

Object.defineProperty($, Util.REST_CAPTURE, {
  enumerable: true,
  configurable: false,
  writable: false,
  value: true,
})
