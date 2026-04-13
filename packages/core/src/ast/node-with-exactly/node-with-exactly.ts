import type { FluentNode } from "@/ast/fluent-node";

export type NodeWithExactly<N> = {
  exactly(n: number): FluentNode<N>;
};
