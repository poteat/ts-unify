/**
 * guardedForPushToFilterMap compiled by createRule and driven through ESLint's
 * RuleTester over the cases below.
 *
 * @scenario
 */
import { createRule } from '@ts-unify/eslint/internal'
import { guardedForPushToFilterMap } from '@ts-unify/rules'

import Tester from '../tester'

describe('guarded-for-push-to-filter-map.eslint', () => {
  Tester.run(
    'guarded-for-push-to-filter-map',
    createRule(guardedForPushToFilterMap, {
      message: 'Use .filter().map() instead of for-of with guarded push',
    }),
    {
      valid: [
        'const result = items.filter(x => x > 0).map(x => x * 2);',
        'for (const x of items) { result.push(x); }',
        'const r = []; for (const x of items) { r.push(x); }',
      ],
      invalid: [
        {
          code:
            'function f() {\n  const result = [];\n  for (const item of ' +
            'items) {\n    if (isValid(item)) {\n      ' +
            'result.push(transform(item));\n    }\n  }\n}',
          errors: [{ messageId: 'match' }],
          output:
            'function f() {\n    const result = items.filter(item => ' +
            'isValid(item)).map(item => transform(item));\n}',
        },
        {
          code:
            'function f() {\n  setup();\n  const out = [];\n  for (const x ' +
            'of xs) {\n    if (x > 0) {\n      out.push(x * 2);\n    }\n  ' +
            '}\n  cleanup();\n}',
          errors: [{ messageId: 'match' }],
          output:
            'function f() {\n    setup();\n    const out = xs.filter(x => ' +
            'x > 0).map(x => x * 2);\n    cleanup();\n}',
        },
      ],
    },
  )
})
