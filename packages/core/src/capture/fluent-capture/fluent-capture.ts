import type { TSESTree } from '@typescript-eslint/types'

import type { NormalizeCaptured } from '@/ast/normalize-captured'
import type {
  CaptureMods,
  ModDefault,
  ModMap,
  ModTruthy,
  ModWhen,
} from '@/capture/capture-mods/capture-mods'
import type { Capture } from '@/capture/capture-type'
import type { DollarObjectSpread } from '@/capture/dollar-spread/dollar-spread'
import type { Spread } from '@/capture/spread/spread'

export type CaptureBase<Name extends string, Value> = Capture<Name, Value> &
  Iterable<Spread<Name, Value>> &
  DollarObjectSpread

/**
 * Shared fluent ops for capture-like carriers.
 */
export type FluentOps<Self, Value> = {
  readonly map: <New>(
    fn: (value: Value) => New,
  ) => Self & CaptureMods<ModMap<NormalizeCaptured<New>>>
  readonly default: <Expr>(
    expr: Expr,
  ) => Self & CaptureMods<ModDefault<NormalizeCaptured<Expr>>>
  readonly defaultUndefined: () => Self &
    CaptureMods<ModDefault<TSESTree.Identifier>>
  readonly truthy: () => Self & CaptureMods<ModTruthy>
  readonly when: (<Narrow extends Value>(
    guard: (value: Value) => value is Narrow,
  ) => Self & CaptureMods<ModWhen<Narrow>>) &
    ((predicate: (value: Value) => boolean) => Self)
}

export interface FluentCapture<Name extends string, Value>
  extends
    CaptureBase<Name, Value>,
    FluentOps<FluentCapture<Name, Value>, Value> {}
