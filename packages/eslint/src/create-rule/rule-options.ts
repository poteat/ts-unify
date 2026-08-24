/**
 * What `createRule` takes beside the transform; a caller passes any part
 * of it, and what is absent takes its default.
 */
export type RuleOptions = {
  /**
   * The report's message, over the chain's `.message()`.
   */
  message: string | undefined

  /**
   * Whether the top-level rewrite becomes a fix; false withholds it.
   */
  fix: boolean
}
