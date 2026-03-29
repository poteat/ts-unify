import type { NodeWithWhen } from "@/ast/node-with-when";
import type { NodeWithTo } from "@/ast/node-with-to";
import type { NodeWithSeal } from "@/ast/node-with-seal";
import type { NodeWithDefault } from "@/ast/node-with-default";
import type { NodeWithDefaultUndefined } from "@/ast/node-with-default-undefined";
import type { NodeWithTruthy } from "@/ast/node-with-truthy";
import type { NodeWithWith } from "@/ast/node-with-with";
import type { NodeWithBind } from "@/ast/node-with-bind";

/**
 * FluentNode<N>
 *
 * A node shape `N` augmented with fluent pattern helpers:
 * - `.when(...)` constraints (see NodeWithWhen)
 * - `.to(...)` terminal rewrite (see NodeWithTo)
 */
export declare const FLUENT_INNER: unique symbol;

export type FluentNode<N> = { readonly [FLUENT_INNER]: N } &
  NodeWithWhen<N> &
  NodeWithDefault<N> &
  NodeWithDefaultUndefined<N> &
  NodeWithTruthy<N> &
  NodeWithWith<N> &
  NodeWithSeal<N> &
  NodeWithTo<N> &
  NodeWithBind<N>;
