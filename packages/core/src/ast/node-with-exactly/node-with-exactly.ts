import type { FluentNode } from '@/ast/fluent-node'

export type NodeWithExactly<N> = {
  readonly exactly: (n: number) => FluentNode<N>
}
