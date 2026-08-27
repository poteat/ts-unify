/**
 * elideBracesForReturn compiled by createRule and driven through ESLint's
 * RuleTester over the cases below.
 *
 * @scenario
 */
import { createRule } from '@ts-unify/eslint/internal'
import { elideBracesForReturn } from '@ts-unify/rules'

import Tester from '../tester'

describe('elide-braces-for-return.eslint', () => {
  Tester.run(
    createRule(elideBracesForReturn, {
      message: 'Elide braces for arrow function with single return',
    }),
    'elide-braces-for-return',
    {
      valid: [
        'const f = (x) => x + 1;',
        'function foo() { return 1; }',
        'const f = () => { a(); b(); };',
        'const f = () => { const x = 1; return x; };',
      ],
      invalid: [
        {
          code: 'const f = (x) => { return x + 1; };',
          errors: [{ messageId: 'match' }],
          output: 'const f = (x) => x + 1;',
        },
        {
          code: 'const g = () => { return 42; };',
          errors: [{ messageId: 'match' }],
          output: 'const g = () => 42;',
        },
      ],
    },
  )
})
