/**
 * typeofUndefinedToNullishCheck compiled by createRule and driven through
 * ESLint's RuleTester over the cases below.
 *
 * @scenario
 */
import { createRule } from '@ts-unify/eslint/internal'
import { typeofUndefinedToNullishCheck } from '@ts-unify/rules'

import Tester from '../tester'

describe('typeof-undefined-to-nullish-check.eslint', () => {
  Tester.run(
    'typeof-undefined',
    createRule(typeofUndefinedToNullishCheck, {
      message: "Use == null instead of typeof === 'undefined'",
      canFix: true,
    }),
    {
      valid: ["typeof x === 'string';", 'x === undefined;'],
      invalid: [
        {
          code: "typeof x === 'undefined';",
          errors: [{ messageId: 'match' }],
          output: 'x == null;',
        },
        {
          code: "typeof foo == 'undefined';",
          errors: [{ messageId: 'match' }],
          output: 'foo == null;',
        },
      ],
    },
  )
})
