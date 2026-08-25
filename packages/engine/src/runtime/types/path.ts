/**
 * Property keys and array indices from the root of a matched node down to
 * one of its positions; inner `.to()` rewrites and capture rebinding use it.
 */
export type Path = ReadonlyArray<string | number>
