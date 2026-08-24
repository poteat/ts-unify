import type { CaptureBase } from './capture-base'
import type { FluentOps } from './fluent-ops'

/**
 * A capture token with the fluent methods, each of which returns this same
 * kind of token with one more modifier recorded.
 *
 * @typeParam Name literal name of the capture
 * @typeParam Value type of the captured value
 */
export interface FluentCapture<Name extends string, Value>
  extends
    CaptureBase<Name, Value>,
    FluentOps<FluentCapture<Name, Value>, Value> {}
