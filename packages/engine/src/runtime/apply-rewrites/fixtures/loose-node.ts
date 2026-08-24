/**
 * A pattern node of the loose builder.
 */
export type LooseNode = {
  /**
   * The node with a rewrite site: the factory runs on the untyped bag of
   * a match.
   */
  to: (factory: (bag: Record<string, unknown>) => unknown) => LooseNode
}
