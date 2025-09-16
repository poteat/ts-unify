import type { TSESTree } from "@typescript-eslint/types";
import type { NodeKind } from "@/ast/node-kind";

/**
 * Map node kind → concrete `TSESTree.Node` interface for that kind.
 *
 * - Uses the `type` discriminant to extract the specific interface.
 * - Keeps a precise association without copying upstream node definitions.
 */
export type NodeByKind = {
  [K in NodeKind]: Extract<
    TSESTree.Node,
    { type: (typeof TSESTree.AST_NODE_TYPES)[K] }
  >;
};

