import type { NodeWithWhen } from "@/ast/node-with-when";
import type { NodeWithTo } from "@/ast/node-with-to";
import type { NodeWithSeal } from "@/ast/node-with-seal";
import type { NodeWithDefault } from "@/ast/node-with-default";
import type { NodeWithDefaultUndefined } from "@/ast/node-with-default-undefined";
import type { NodeWithTruthy } from "@/ast/node-with-truthy";
import type { NodeWithWith } from "@/ast/node-with-with";
import type { NodeWithBind } from "@/ast/node-with-bind";
import type { NodeWithUntil } from "@/ast/node-with-until";
import type { NodeWithWhere } from "@/ast/node-with-where";
import type { NodeWithNone } from "@/ast/node-with-none";
import type { NodeWithSome } from "@/ast/node-with-some";
import type { NodeWithAtLeast } from "@/ast/node-with-at-least";
import type { NodeWithAtMost } from "@/ast/node-with-at-most";
import type { NodeWithExactly } from "@/ast/node-with-exactly";

export declare const FLUENT_INNER: unique symbol;

/**
 * A node shape `N` augmented with fluent pattern helpers:
 * `.when()`, `.with()`, `.bind()`, `.seal()`, `.to()`,
 * `.where()`, `.until()`, `.none()`, `.some()`,
 * `.atLeast()`, `.atMost()`, `.exactly()`, etc.
 */
export type FluentNode<N> = { readonly [FLUENT_INNER]: N } &
  NodeWithWhen<N> &
  NodeWithDefault<N> &
  NodeWithDefaultUndefined<N> &
  NodeWithTruthy<N> &
  NodeWithWith<N> &
  NodeWithSeal<N> &
  NodeWithTo<N> &
  NodeWithBind<N> &
  NodeWithUntil<N> &
  NodeWithWhere<N> &
  NodeWithNone<N> &
  NodeWithSome<N> &
  NodeWithAtLeast<N> &
  NodeWithAtMost<N> &
  NodeWithExactly<N>;
