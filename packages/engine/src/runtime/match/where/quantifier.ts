/**
 * How many matches a `.where()` constraint asks for, as a test over the
 * count.
 */
export type Quantifier = {
  kind: 'none' | 'some' | 'atLeast' | 'atMost' | 'exactly'

  /**
   * Whether the count satisfies the quantifier.
   */
  test: (n: number) => boolean
}
