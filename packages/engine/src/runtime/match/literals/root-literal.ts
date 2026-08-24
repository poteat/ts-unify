/**
 * One literal a pattern requires under the node it matches: the value at
 * `path` must be one of `values`.
 *
 * The values are the literal the pattern holds there, or those the
 * literal alternatives of a `U.or` there allow. `key` is the path as one
 * string, for the literals of two patterns at one path to be told alike.
 */
export type RootLiteral = {
  key: string
  path: readonly string[]
  values: readonly unknown[]
}
