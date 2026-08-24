import type { AstTransform } from '@/ast/ast-transform'

/**
 * What `.to(...)` returns: an `AstTransform` that is still a
 * `Pattern<Node>`.
 *
 * It carries `from`, `to`, `message` and kin, and embeds in another
 * pattern's shape.
 */
export type ToAttached<
  Node,
  Result,
  Cfg extends Record<string, unknown> = {},
> = Node & AstTransform<Node, Result, Cfg>
