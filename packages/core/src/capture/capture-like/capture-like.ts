import type { Capture } from '@/capture/capture-type'
import type { $ } from '@/capture/dollar'

/**
 * Either token a pattern position may carry: the bare placeholder `$` or an
 * explicit `Capture`.
 *
 * @typeParam Value type the explicit capture may carry
 */
export type CaptureLike<Value = unknown> =
  | $
  | Capture<string, Value>
  | Capture<string, unknown>
