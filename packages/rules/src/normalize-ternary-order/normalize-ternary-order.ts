import { U } from '@ts-unify/core'

import { inequalityTernary } from './inequality-ternary'
import { negatedTernary } from './negated-ternary'
import { positiveTest } from './positive-test'

/**
 * A ternary tested on a negation or an inequality has its branches
 * swapped and the test made positive.
 *
 * @example `!c ? a : b` becomes `c ? b : a`; `x !== y ? a : b` becomes
 * `x === y ? b : a`
 */
export const normalizeTernaryOrder = U.or(negatedTernary, inequalityTernary)
  .with(({ consequent: alternate, alternate: consequent }) => ({
    consequent,
    alternate,
  }))
  .with(bag => ({ test: positiveTest(bag) }))
  .to(bag => U.ConditionalExpression(bag))
  .message('Normalize ternary to use positive condition')
  .recommended()
