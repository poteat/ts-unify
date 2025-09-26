import type { TruthyGuard } from "@/ast/builder-helpers";

/**
 * BuilderUtilities
 *
 * Typed helper utilities exposed alongside builders on the `U` namespace.
 * These are not tied to a specific AST kind and are convenient when composing
 * fluent helpers.
 */
export type BuilderUtilities = {
  truthy: TruthyGuard;
};
