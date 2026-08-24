/**
 * The plan of a string predicate, or the `RegExp` sugar for one.
 */
export type StringPlan = {
  kind: 'string'

  /**
   * Whether the value passes the predicate; false for a non-string.
   */
  test: (actual: unknown) => boolean
}
