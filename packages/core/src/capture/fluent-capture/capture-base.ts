import type { Capture } from '@/capture/capture-type'
import type { DollarObjectSpread } from '@/capture/dollar-spread'
import type { Spread } from '@/capture/spread'

/**
 * What `$(name)` returns before its fluent methods: a capture token that
 * also spreads into a sequence and into an object pattern.
 *
 * @typeParam Name literal name of the capture
 * @typeParam Value type of the captured value
 */
export type CaptureBase<Name extends string, Value> = Capture<Name, Value> &
  Iterable<Spread<Name, Value>> &
  DollarObjectSpread
