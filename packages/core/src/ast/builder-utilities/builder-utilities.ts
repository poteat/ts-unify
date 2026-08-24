import type { TruthyGuard } from '@/ast/builder-helpers'
import type { FromNode } from '@/ast/from-node'
import type { MaybeBlockCombinator } from '@/ast/maybe-block'
import type { SeqCombinator } from '@/ast/node-with-seq'
import type { OrCombinator } from '@/ast/or'
import type { StringPredicates } from '@/string-predicate/string-predicates'

/**
 * The helpers on the `U` namespace that belong to no AST kind: guards,
 * combinators and the string predicates, for composing patterns.
 */
export type BuilderUtilities = {
  truthy: TruthyGuard
  or: OrCombinator
  maybeBlock: MaybeBlockCombinator
  fromNode: FromNode
  seq: SeqCombinator

  /**
   * Predicates for the string positions of a pattern, each callable on a
   * captured value too; see string-predicate.spec.md.
   */
  readonly string: StringPredicates
}
