import type { TSESTree } from '@typescript-eslint/types'

import type { NormalizeCaptured } from '@/ast/normalize-captured'
import type {
  CaptureMods,
  ModDefault,
  ModMap,
  ModTruthy,
  ModWhen,
} from '@/capture/capture-mods'

/**
 * Fluent methods shared by every capture-like carrier; each returns the
 * carrier with one more modifier recorded in its type.
 *
 * @typeParam Self type of the carrier the methods return
 * @typeParam Value type of the captured value the methods act on
 */
export type FluentOps<Self, Value> = {
  /**
   * Records a mapping: after binding, the captured value is what `fn`
   * returns, normalized as a captured node.
   */
  readonly map: <New>(
    fn: (value: Value) => New,
  ) => Self & CaptureMods<ModMap<NormalizeCaptured<New>>>

  /**
   * Records a fallback: a falsy captured value is replaced by `expr`.
   */
  readonly default: <Expr>(
    expr: Expr,
  ) => Self & CaptureMods<ModDefault<NormalizeCaptured<Expr>>>

  /**
   * Records `Identifier("undefined")` as the fallback for a falsy value.
   */
  readonly defaultUndefined: () => Self &
    CaptureMods<ModDefault<TSESTree.Identifier>>

  /**
   * Records that falsy constituents leave the captured value's type.
   */
  readonly truthy: () => Self & CaptureMods<ModTruthy>

  /**
   * Records a guard: a type guard narrows the captured value to what it
   * admits; a boolean predicate filters matches and leaves the type alone.
   */
  readonly when: (<Narrow extends Value>(
    guard: (value: Value) => value is Narrow,
  ) => Self & CaptureMods<ModWhen<Narrow>>) &
    ((predicate: (value: Value) => boolean) => Self)
}
