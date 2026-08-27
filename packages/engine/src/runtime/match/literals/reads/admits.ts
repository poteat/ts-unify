import type { RootLiteral } from '@ts-unify/engine/runtime/match/literals/types'
/**
 * Whether a root literal allows a value read at its path.
 *
 * @param literal the root literal
 * @param value the value read
 * @returns true when it is among the literal's allowed values
 */
export const admits = (literal: RootLiteral, value: unknown): boolean =>
  literal.values.includes(value)
