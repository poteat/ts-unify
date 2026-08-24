import type { FluentNode } from '@/ast/fluent-node'

export type NodeWithAtLeast<N> = {
  readonly atLeast: (n: number) => FluentNode<N>
}
