/**
 * normalizeTernaryOrder compiled by createRule and driven through ESLint's
 * RuleTester over the cases below.
 *
 * @scenario
 */
import { createRule } from '@ts-unify/eslint/internal'
import { normalizeTernaryOrder } from '@ts-unify/rules'

import Tester from '../tester'

describe('normalize-ternary-order.eslint', () => {
  Tester.run(
    'normalize-ternary-order',
    createRule(normalizeTernaryOrder, {
      message: 'Normalize ternary to use positive condition',
    }),
    {
      valid: [
        {
          name: 'an identifier test, no BinaryExpression',
          code: 'const x = cond ? a : b;',
        },
        {
          name: 'a call test, no BinaryExpression',
          code: 'const x = isReady() ? a : b;',
        },
        {
          name: 'a === test; the guard admits only !== and !=',
          code: 'const x = a === b ? c : d;',
        },
      ],
      invalid: [
        {
          name: '!== becomes === with the branches swapped',
          code: 'const x = a !== b ? c : d;',
          errors: [{ messageId: 'match' }],
          output: 'const x = a === b ? d : c;',
        },
        {
          name: '!= becomes == with the branches swapped',
          code: 'const x = a != b ? c : d;',
          errors: [{ messageId: 'match' }],
          output: 'const x = a == b ? d : c;',
        },
      ],
    },
  )
})
