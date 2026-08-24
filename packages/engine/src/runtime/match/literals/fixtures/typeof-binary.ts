import { U } from '@ts-unify/core/internal'

/**
 * The fields of a `typeof x == y` comparison, with a `U.or` operator.
 */
export const TYPEOF_BINARY = {
  operator: U.or('===', '=='),
  left: U.UnaryExpression({ operator: 'typeof' }),
}
