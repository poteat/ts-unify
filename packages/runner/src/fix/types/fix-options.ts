/**
 * How {@link fix} turns text into a tree and a rewritten tree back into
 * text, and how long it keeps going.
 */
export type FixOptions = {
  /**
   * Turns source text into an AST (with loc/range).
   */
  parse: (source: string) => unknown

  /**
   * Turns a reified ESTree node back into source text.
   */
  serialize: (node: unknown) => string

  /**
   * Maximum fixpoint iterations (default 10).
   */
  maxIterations?: number
}
