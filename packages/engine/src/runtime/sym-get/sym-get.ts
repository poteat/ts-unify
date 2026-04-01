/**
 * Access a symbol-keyed property on an unknown value.
 * This is the single escape hatch for symbol indexing on unknown.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function symGet(v: unknown, s: symbol): unknown {
  return (v as any)[s];
}
