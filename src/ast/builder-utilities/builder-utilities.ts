import type { TruthyGuard } from "@/ast/builder-helpers";
import type { OrCombinator } from "@/ast/or";
import type { FromNode } from "@/ast/from-node";
import type { MaybeBlockCombinator } from "@/ast/maybe-block";

/**
 * BuilderUtilities
 *
 * Typed helper utilities exposed alongside builders on the `U` namespace.
 * These are not tied to a specific AST kind and are convenient when composing
 * fluent helpers.
 */
export type BuilderUtilities = {
  truthy: TruthyGuard;
  or: OrCombinator;
  maybeBlock: MaybeBlockCombinator;
  fromNode: FromNode;
};
