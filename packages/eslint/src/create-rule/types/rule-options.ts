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
   * Whether the rewrites become fixes; false reports alone, every site
   * withheld.
   */
  canFix: boolean
}
