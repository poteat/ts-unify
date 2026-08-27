/**
 * Reads a symbol-keyed property off a value of unknown type: the one
 * place symbol indexing on `unknown` is spelled.
 *
 * @param v the value that may carry the property
 * @param s the symbol that keys it
 * @returns the property under the symbol, or undefined when none is there
 */
export const symGet = (v: unknown, s: symbol): unknown =>
  (v as Record<symbol, unknown>)[s]
