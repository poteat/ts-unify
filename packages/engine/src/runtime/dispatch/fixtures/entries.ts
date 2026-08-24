import { $, U } from '@ts-unify/core/internal'

/**
 * Five entries of one tag: three with a literal `operator`, one with
 * none, and one with a `U.or` of two.
 */
export const ENTRIES = [
  { name: 'and', pattern: { operator: '&&', right: $('r') } },
  { name: 'or', pattern: { operator: '||', left: U.Identifier() } },
  { name: 'any', pattern: { left: $('l') } },
  { name: 'or-id', pattern: { operator: '||', left: U.Identifier() } },
  { name: 'eq', pattern: { operator: U.or('==', '===') } },
] as const
