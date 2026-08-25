import type { FieldPlan } from './entries'
/**
 * The plan of a fields record: each property matched in turn against the
 * node's, and, when written with `{ ...$ }`, the rest captured by name.
 */
export type FieldsPlan = {
  kind: 'fields'
  fields: readonly FieldPlan[]

  /**
   * The keys the record names; null when it does not capture the rest.
   */
  named: ReadonlySet<string> | null
}
