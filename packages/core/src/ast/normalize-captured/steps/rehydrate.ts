import type { TSESTree } from '@typescript-eslint/types'

/**
 * The parser's node interface for a shape with a `type` tag; any other
 * type passes through.
 */
export type Rehydrate<T> = T extends { type: infer Tag }
  ? Extract<TSESTree.Node, { type: Tag }>
  : T
