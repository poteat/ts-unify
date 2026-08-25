/**
 * One rule firing on one node: where, what it says, and the rewrite it
 * proposes.
 */
export type LintMatch = {
  rule: string
  message: string
  line: number
  column: number
  endLine: number
  endColumn: number

  /**
   * The output node the rule's rewrite produced, if any.
   */
  reified: unknown
}
