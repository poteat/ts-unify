/**
 * Access a symbol-keyed property on an unknown value.
 * This is the single escape hatch for symbol indexing on unknown.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const symGet = (v: unknown, s: symbol): unknown => (v as any)[s]
