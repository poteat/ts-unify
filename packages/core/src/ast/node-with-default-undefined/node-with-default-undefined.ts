import type { TSESTree } from '@typescript-eslint/types'

import type { NarrowSingleCapture } from '@/ast/narrow-single-capture'

/**
 * Adds a fluent `.defaultUndefined()` for single-capture nodes: sugar for
 * `.default(U.Identifier({ name: "undefined" }))`.
 */
export type NodeWithDefaultUndefined<Node> = Node & {
  /**
   * Substitutes the identifier `undefined` for the one capture when it is
   * absent; callable only on a node with exactly one capture.
   */
  readonly defaultUndefined: () => NarrowSingleCapture<
    Node,
    TSESTree.Identifier
  >
}
