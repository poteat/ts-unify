import type { RuleContext } from './context'
import type { Visitors } from './visitors'

/**
 * ESLint rule module produced by createRule.
 */
export type RuleModule = {
  meta: {
    type: 'suggestion'
    fixable?: 'code'
    messages: Record<string, string>
  }

  /**
   * Builds the rule's visitors for one file, given its context.
   *
   * @param context the file's ESLint rule context
   * @returns the node-type visitors ESLint calls over the file
   */
  create: (context: RuleContext) => Visitors
}
