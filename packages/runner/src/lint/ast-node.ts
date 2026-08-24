/**
 * An ESTree node as the walker reads it: a `type`, the location the parser
 * attached, the parent the walker attaches, and fields without a schema.
 */
export type AstNode = {
  type: string
  loc?: {
    start: { line: number; column: number }
    end: { line: number; column: number }
  }
  parent?: unknown
  [field: string]: unknown
}
