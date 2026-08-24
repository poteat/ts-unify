import { U } from '@ts-unify/core/internal'

/**
 * A rewrite factory that reads nothing of its bag and builds the
 * identifier `X`.
 */
export const identX = () => U.Identifier({ name: 'X' })
