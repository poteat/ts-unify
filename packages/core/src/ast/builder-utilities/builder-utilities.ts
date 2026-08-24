import type { TruthyGuard } from "@/ast/builder-helpers";
import type { OrCombinator } from "@/ast/or";
import type { FromNode } from "@/ast/from-node";
import type { MaybeBlockCombinator } from "@/ast/maybe-block";
import type { SeqCombinator } from "@/ast/node-with-seq";
import type { StringPredicates } from "@/string-predicate/string-predicates";

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
  seq: SeqCombinator;
  /** String predicates for string positions and captured values; see string-predicate.spec.md. */
  string: StringPredicates;
};
