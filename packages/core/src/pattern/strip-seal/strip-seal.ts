import type { Sealed } from '@/ast/sealed'

/**
 * The inner type of a sealed subtree; any other type passes through as it
 * is.
 */
export type StripSeal<T> = T extends Sealed<infer Inner> ? Inner : T
