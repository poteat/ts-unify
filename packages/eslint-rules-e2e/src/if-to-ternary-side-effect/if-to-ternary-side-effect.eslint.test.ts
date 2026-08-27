/**
 * ifToTernarySideEffect compiled by createRule and driven through ESLint's
 * RuleTester over the cases below.
 *
 * @scenario
 */
import { createRule } from '@ts-unify/eslint/internal'
import { ifToTernarySideEffect } from '@ts-unify/rules'

import Tester from '../tester'

describe('if-to-ternary-side-effect.eslint', () => {
  Tester.run(
    createRule(ifToTernarySideEffect, {
      message: 'Use ternary expression instead of if/else side effects',
    }),
    'if-to-ternary-side-effect',
    {
      valid: [
        'cond ? doA() : doB();',
        'if (cond) { doA(); } else { return b; }',
        'if (cond) { doA(); }',
      ],
      invalid: [
        {
          code: 'if (cond) { doA(); } else { doB(); }',
          errors: [{ messageId: 'match' }],
          output: 'cond ? doA() : doB();',
        },
        {
          code: 'if (cond) doA(); else doB();',
          errors: [{ messageId: 'match' }],
          output: 'cond ? doA() : doB();',
        },
      ],
    },
  )
})
