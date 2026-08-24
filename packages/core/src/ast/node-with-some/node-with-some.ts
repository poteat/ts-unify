import type { FluentNode } from '@/ast/fluent-node'

export type NodeWithSome<N> = {
  readonly some: () => FluentNode<N>
}
