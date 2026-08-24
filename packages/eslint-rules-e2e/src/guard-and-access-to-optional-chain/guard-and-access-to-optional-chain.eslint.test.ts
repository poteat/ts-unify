/**
 * guardAndAccessToOptionalChain compiled by createRule and driven through
 * ESLint's RuleTester over the cases below.
 *
 * @scenario
 */
import { createRule } from '@ts-unify/eslint/internal'
import { guardAndAccessToOptionalChain } from '@ts-unify/rules'

import Tester from '../tester'

describe('guard-and-access-to-optional-chain.eslint', () => {
  Tester.run(
    'guard-and-access',
    createRule(guardAndAccessToOptionalChain, {
      message: 'Use optional chaining',
    }),
    {
      valid: ['obj?.prop;', 'obj || obj.prop;', 'obj && other.prop;'],
      invalid: [
        {
          code: 'obj && obj.prop;',
          errors: [{ messageId: 'match' }],
          output: 'obj?.prop;',
        },
      ],
    },
  )
})
