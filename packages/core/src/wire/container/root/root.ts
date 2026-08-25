/**
 * What a container with no parent scope stands on: a parent that accepts
 * no provider.
 */
export type Root = {
  /**
   * The phantom a child's own `accepts` is intersected with; here it
   * admits nothing.
   */
  readonly accepts?: (provider: never) => void
}
