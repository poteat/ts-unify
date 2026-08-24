/**
 * ifReturnToTernary compiled by createRule and driven through ESLint's
 * RuleTester over the cases below.
 *
 * @scenario
 */
import { createRule } from '@ts-unify/eslint/internal'
import { ifReturnToTernary } from '@ts-unify/rules'

import Tester from '../tester'

describe('if-return-to-ternary.eslint', () => {
  Tester.run(
    'if-return-to-ternary',
    createRule(ifReturnToTernary, {
      message: 'Use ternary return instead of if/else return',
    }),
    {
      valid: [
        'return cond ? a : b;',
        'if (cond) { doSomething(); } else { return b; }',
        'if (cond) { return a; }',
      ],
      invalid: [
        {
          code: 'function f() { if (cond) { return a; } else { return b; } }',
          errors: [{ messageId: 'match' }],
          output: 'function f() { return cond ? a : b; }',
        },
        {
          code: 'function f() { if (cond) return a; else return b; }',
          errors: [{ messageId: 'match' }],
          output: 'function f() { return cond ? a : b; }',
        },
      ],
    },
  )
})
