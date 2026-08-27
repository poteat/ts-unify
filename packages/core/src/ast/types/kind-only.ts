import type { NodeByKind } from '@/ast/node-by-kind'
import type { NodeKind } from '@/ast/node-kind'

/**
 * A node of kind `K` known by its `type` tag alone: what a builder
 * called with nothing, or a `{ type }` alone, matches.
 */
export type KindOnly<K extends NodeKind> = {
  readonly type: NodeByKind[K]['type']
}
