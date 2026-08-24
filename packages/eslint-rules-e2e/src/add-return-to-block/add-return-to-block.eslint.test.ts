/**
 * addReturnToBlock compiled by createRule and driven through ESLint's
 * RuleTester over the cases below.
 *
 * @scenario
 */
import { createRule } from '@ts-unify/eslint/internal'
import { addReturnToBlock } from '@ts-unify/rules'

import Tester from '../tester'

describe('add-return-to-block.eslint', () => {
  Tester.run(
    'add-return-to-block',
    createRule(addReturnToBlock, {
      message: 'Add return to single-expression function body',
    }),
    {
      valid: [
        'function foo() { return bar(); }',
        'function foo() { a(); b(); }',
        'const x = () => bar();',
        'if (true) { bar(); }',
      ],
      invalid: [
        {
          code: 'function foo() { bar(); }',
          errors: [{ messageId: 'match' }],
          output: 'function foo() {\n    return bar();\n}',
        },
        {
          code: 'const f = function() { doSomething(); };',
          errors: [{ messageId: 'match' }],
          output: 'const f = function() {\n    return doSomething();\n};',
        },
        {
          code: 'const f = () => { doSomething(); };',
          errors: [{ messageId: 'match' }],
          output: 'const f = () => {\n    return doSomething();\n};',
        },
      ],
    },
  )
})
