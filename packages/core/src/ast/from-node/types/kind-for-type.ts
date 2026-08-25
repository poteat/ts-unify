import type { NodeByKind } from '@/ast/node-by-kind'
import type { NodeKind } from '@/ast/node-kind'

/**
 * The node kind whose `type` field is `V`: the `NodeKind` to `type`
 * mapping inverted.
 */
export type KindForType<V> = {
  [K in NodeKind]: NodeByKind[K]['type'] extends V ? K : never
}[NodeKind]
