import type { FluentNode } from "@/ast/fluent-node";

export type NodeWithAtLeast<N> = {
  atLeast(n: number): FluentNode<N>;
};
