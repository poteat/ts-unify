import type { TSESTree } from "@typescript-eslint/types";

/**
 * AST node discriminant (aka "kind"), mirroring `TSESTree.AST_NODE_TYPES` keys.
 *
 * - Stable string-literal union of all node kinds supported by
 *   `@typescript-eslint/types`.
 * - Used to index `NodeByKind` and to key builder maps.
 */
export type NodeKind = keyof typeof TSESTree.AST_NODE_TYPES;

