import type { TSESTree } from '@typescript-eslint/types'

/**
 * The comments inside a node, read from ESLint's `SourceCode`; none when
 * the surface handed in does not carry `getCommentsInside`.
 * @param sourceCode the rule context's source
 * @param node the node
 */
export function commentsInside(
  sourceCode: unknown,
  node: TSESTree.Node,
): readonly TSESTree.Comment[] {
  if (
    typeof sourceCode !== 'object' ||
    !sourceCode ||
    !('getCommentsInside' in sourceCode) ||
    typeof sourceCode.getCommentsInside !== 'function'
  ) {
    return []
  }

  const comments: unknown = sourceCode.getCommentsInside(node)

  return Array.isArray(comments) ? (comments as TSESTree.Comment[]) : []
}
