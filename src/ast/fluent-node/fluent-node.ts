import type { NodeWithWhen } from "@/ast/node-with-when";
import type { NodeWithTo } from "@/ast/node-with-to";
import type { NodeWithSeal } from "@/ast/node-with-seal";

/**
 * FluentNode<N>
 *
 * A node shape `N` augmented with fluent pattern helpers:
 * - `.when(...)` constraints (see NodeWithWhen)
 * - `.to(...)` terminal rewrite (see NodeWithTo)
 */
export type FluentNode<N> = NodeWithWhen<N> & NodeWithSeal<N> & NodeWithTo<N>;
