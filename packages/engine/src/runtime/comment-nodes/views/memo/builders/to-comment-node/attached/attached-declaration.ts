import type { TSESTree } from '@typescript-eslint/types'

import Tokens from './tokens'
/**
 * The outermost declaration starting at the first token after a comment,
 * or null when no declaration starts there.
 *
 * @param raw the parser's comment
 * @param starts the declarations by start offset
 * @param tokenStarts the start offsets of the tokens, ascending
 * @returns the declaration starting at the next token, or null when none starts
 *          there or no token follows
 */
export function attachedDeclaration(
  raw: TSESTree.Comment,
  starts: ReadonlyMap<number, TSESTree.Node>,
  tokenStarts: readonly number[],
): TSESTree.Node | null {
  const next = Tokens.firstAtOrAfter(tokenStarts, raw.range[1])

  return next === undefined ? null : (starts.get(next) ?? null)
}
