import type { Position } from './position'

/**
 * An ESTree node as the walker reads it: a `type`, the location the parser
 * attached, the parent the walker attaches, and fields without a schema.
 */
export type AstNode = {
  type: string
  loc?: { start: Position; end: Position }
  parent?: unknown
  [field: string]: unknown
}
