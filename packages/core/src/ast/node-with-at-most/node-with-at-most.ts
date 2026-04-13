import type { FluentNode } from "@/ast/fluent-node";

export type NodeWithAtMost<N> = {
  atMost(n: number): FluentNode<N>;
};
