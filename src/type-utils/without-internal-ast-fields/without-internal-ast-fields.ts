/**
 * Distributively omit internal ESTree fields (`parent`, `loc`, `range`) from a
 * union of AST node shapes.
 */
export type WithoutInternalAstFields<T> = T extends any
  ? Omit<T, "parent" | "loc" | "range">
  : never;
