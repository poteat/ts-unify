import type { FluentNode } from '@/ast/fluent-node'
import type { NodeByKind } from '@/ast/node-by-kind'
import type { NodeKind } from '@/ast/node-kind'
import type { OmitDistributive } from '@/ast/omit-distributive'
import type { BindCaptures } from '@/capture'
import type { WithoutInternalAstFields } from '@/type-utils'

import type { KindForType } from './types'

/**
 * Builds a fluent node from an object whose `type` field names the kind,
 * as `U.<Kind>(...)` does with the builder's name.
 *
 * `({ type })` alone matches any node of the kind; `({ type, ...shape })`
 * builds a concrete node; `({ type, ...pattern })` with captures in it
 * matches a pattern.
 */
export type FromNode = {
  <V extends NodeByKind[NodeKind]['type'], K extends KindForType<V>>(input: {
    type: V
  }): FluentNode<{ readonly type: NodeByKind[K]['type'] }>

  <
    V extends NodeByKind[NodeKind]['type'],
    K extends KindForType<V>,
    S extends OmitDistributive<WithoutInternalAstFields<NodeByKind[K]>, 'type'>,
  >(
    input: { type: V } & S,
  ): FluentNode<NodeByKind[K]>

  <P extends { type: NodeByKind[NodeKind]['type'] }>(
    input: P,
  ): FluentNode<
    P['type'] extends infer V
      ? V extends NodeByKind[NodeKind]['type']
        ? BindCaptures<
            { type: V } & (P extends object ? Omit<P, 'type'> : P),
            WithoutInternalAstFields<NodeByKind[KindForType<V>]>
          >
        : never
      : never
  >
}
