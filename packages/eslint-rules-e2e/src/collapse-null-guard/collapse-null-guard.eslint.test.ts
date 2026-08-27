/**
 * collapseNullGuard compiled by createRule and driven through ESLint's
 * RuleTester over the cases below.
 *
 * @scenario
 */
import { createRule } from '@ts-unify/eslint/internal'
import { collapseNullGuard } from '@ts-unify/rules'

import Tester from '../tester'

describe('collapse-null-guard.eslint', () => {
  Tester.run(
    createRule(collapseNullGuard, {
      message: 'Use ?? instead of null guard with early return',
    }),
    'collapse-null-guard',
    {
      valid: [
        'function f(x) { return x ?? def; }',
        'function f(x) { if (x !== null) return def; return x; }',
        'function f(x) { if (x === undefined) return def; return x; }',
      ],
      invalid: [
        {
          code: 'function f(x) { if (x === null) return def; return x; }',
          errors: [{ messageId: 'match' }],
          output: 'function f(x) {\n    return x ?? def;\n}',
        },
        {
          code: 'function f(x) { if (x === null) { return def; } return x; }',
          errors: [{ messageId: 'match' }],
          output: 'function f(x) {\n    return x ?? def;\n}',
        },
        {
          code:
            'function f(x) { setup(); if (x === null) return def; return ' +
            'x; }',
          errors: [{ messageId: 'match' }],
          output: 'function f(x) {\n    setup();\n    return x ?? def;\n}',
        },
      ],
    },
  )
})
