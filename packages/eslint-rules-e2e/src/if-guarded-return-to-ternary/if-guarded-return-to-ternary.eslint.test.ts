/**
 * ifGuardedReturnToTernary compiled by createRule and driven through ESLint's
 * RuleTester over the cases below.
 *
 * @scenario
 */
import { createRule } from '@ts-unify/eslint/internal'
import { ifGuardedReturnToTernary } from '@ts-unify/rules'

import Tester from '../tester'

describe('if-guarded-return-to-ternary.eslint', () => {
  Tester.run(
    'if-guarded-return-to-ternary',
    createRule(ifGuardedReturnToTernary, {
      message: 'Use ternary instead of if-guarded return',
    }),
    {
      valid: [
        'function f() { return cond ? a : b; }',
        'function f() { if (cond) { return a; } else { return b; } }',
        'function f() { if (cond) { doSomething(); } return b; }',
      ],
      invalid: [
        {
          code: 'function f() { if (cond) { return a; } return b; }',
          errors: [{ messageId: 'match' }],
          output: 'function f() {\n    return cond ? a : b;\n}',
        },
        {
          code: 'function f() { if (cond) return a; return b; }',
          errors: [{ messageId: 'match' }],
          output: 'function f() {\n    return cond ? a : b;\n}',
        },
        {
          code: 'function f() { setup(); if (cond) { return a; } return b; }',
          errors: [{ messageId: 'match' }],
          output: 'function f() {\n    setup();\n    return cond ? a : b;\n}',
        },
      ],
    },
  )
})
