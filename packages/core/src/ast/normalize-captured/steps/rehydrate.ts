import type { TSESTree } from '@typescript-eslint/types'

import type Types from '@/ast/types'

/**
 * The parser's node interface for a shape with a `type` tag; any other
 * type passes through.
 */
export type Rehydrate<T> =
  T extends Types.Typed<infer Tag>
    ? Extract<TSESTree.Node, Types.Typed<Tag>>
    : T
