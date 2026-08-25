/**
 * What a store with no parent stands on: a parent that fills no slot and
 * holds no definition.
 */
export type Root = {
  /**
   * The phantom a child's own `accepts` unions its slots with; here it
   * admits nothing.
   */
  readonly accepts?: (slot: never) => void

  /**
   * The phantom a child's own `holds` unions its definitions with; here
   * it holds nothing.
   */
  readonly holds?: (definition: never) => void
}
