/**
 * singularFunctionToArrow compiled by createRule and driven through ESLint's
 * RuleTester over the cases below.
 *
 * @scenario
 */
import { createRule } from '@ts-unify/eslint/internal'
import { singularFunctionToArrow } from '@ts-unify/rules'

import Tester from '../tester'

describe('singular-function-to-arrow.eslint', () => {
  Tester.run(
    createRule(singularFunctionToArrow, {
      message: 'Convert single-statement function to arrow function',
    }),
    'singular-function-to-arrow',
    {
      valid: [
        'const f = (x) => x + 1;',
        'function foo(x) { const y = x + 1; return y; }',
        'function* gen() { return 1; }',
        {
          name: 'a body reading this',
          code: 'function foo() { return this.x; }',
        },
        {
          name: 'a body reading arguments',
          code: 'function foo() { return arguments[0]; }',
        },
        {
          name: 'this in a default parameter value',
          code: 'function foo(x = this.y) { return x; }',
        },
      ],
      invalid: [
        {
          code: 'function foo(x) { return x + 1; }',
          errors: [{ messageId: 'match' }],
          output: 'const foo = x => x + 1;',
        },
        {
          code: 'const f = function(x) { return x * 2; };',
          errors: [{ messageId: 'match' }],
          output: 'const f = x => x * 2;',
        },
      ],
    },
  )
})
