import type { FluentNode } from '@/ast/fluent-node'

export type NodeWithAtMost<N> = {
  readonly atMost: (n: number) => FluentNode<N>
}
