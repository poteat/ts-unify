import type { FluentNode } from "@/ast/fluent-node";

export type NodeWithSome<N> = {
  some(): FluentNode<N>;
};
