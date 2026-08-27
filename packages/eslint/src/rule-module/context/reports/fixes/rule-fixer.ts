import type { TSESTree } from '@typescript-eslint/types'

import type { RuleFix } from './edits'

/**
 * The two edits a fix here makes: replace a node's text, and insert text
 * before a range (an import at the top of the file).
 */
export type RuleFixer = {
  /**
   * An edit that replaces a node's source text.
   *
   * @param node the node to replace
   * @param text the new text
   * @returns the edit replacing the node's range with the text
   */
  readonly replaceText: (node: TSESTree.Node, text: string) => RuleFix

  /**
   * An edit that inserts text before a range.
   *
   * @param range the range, as `[start, end]` offsets
   * @param text the text to insert
   * @returns the edit inserting the text at the range's start
   */
  readonly insertTextBeforeRange: (
    range: [number, number],
    text: string,
  ) => RuleFix
}
