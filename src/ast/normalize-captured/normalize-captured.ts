import type { UnwrapFluent } from "@/ast/unwrap-fluent";
import type { TSESTree } from "@typescript-eslint/types";

/** Normalize a captured value or template value for substitution. */
export type NormalizeCaptured<V> = _CollapseCategories<
  _Rehydrate<UnwrapFluent<V>>
>;

type _Rehydrate<T> = T extends { type: infer Tag }
  ? Extract<TSESTree.Node, { type: Tag }>
  : T;
type _CollapseCategories<T> = [T] extends [TSESTree.Expression]
  ? TSESTree.Expression
  : [T] extends [TSESTree.Statement]
  ? TSESTree.Statement
  : T;
