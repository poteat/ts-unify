import type { FluentNode } from "@/ast/fluent-node";
import type { SubstituteSingleCapture } from "@/ast/substitute-single-capture";
import type { HasSingleCapture } from "@/ast/capture-cardinality";
import type { TSESTree } from "@typescript-eslint/types";

/**
 * NodeWithDefaultUndefined<Node>
 *
 * Adds a fluent `.defaultUndefined()` for single-capture nodes. This is sugar
 * for providing `Identifier("undefined")` as the default value, equivalent to
 * `.default(U.Identifier({ name: "undefined" }))` at the type level.
 */
export type NodeWithDefaultUndefined<Node> = Node & {
  defaultUndefined(): [HasSingleCapture<Node>] extends [true]
    ? FluentNode<SubstituteSingleCapture<Node, TSESTree.Identifier>>
    : never;
};
