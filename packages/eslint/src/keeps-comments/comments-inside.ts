import type { TSESTree } from '@typescript-eslint/types'

/**
 * What ESLint's `SourceCode` lists within a node's range; none when the
 * surface handed in does not carry `getCommentsInside`.
 *
 * @param sourceCode the rule context's source
 * @param node the node
 * @returns the comments inside the node's range; empty when the source cannot
 *          list them
 */
export function commentsInside(
  sourceCode: unknown,
  node: TSESTree.Node,
): readonly TSESTree.Comment[] {
  const hasGetCommentsInside =
    typeof sourceCode === 'object' &&
    sourceCode !== null &&
    'getCommentsInside' in sourceCode
  const getCommentsInside = hasGetCommentsInside
    ? sourceCode.getCommentsInside
    : undefined
  const hasCommentsInside = typeof getCommentsInside === 'function'

  if (!hasCommentsInside) return []

  const comments: unknown = getCommentsInside.call(sourceCode, node)

  return Array.isArray(comments) ? (comments as TSESTree.Comment[]) : []
}
