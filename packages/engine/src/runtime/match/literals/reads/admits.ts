import type { RootLiteral } from '@engine/runtime/match/literals/types'
/**
 * Whether a root literal allows a value read at its path.
 *
 * @param literal the root literal
 * @param value the value read
 */
export const admits = (literal: RootLiteral, value: unknown): boolean =>
  literal.values.includes(value)
