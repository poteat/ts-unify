/**
 * skippedForPushToFilterMap compiled by createRule and driven through ESLint's
 * RuleTester over the cases below.
 *
 * @scenario
 */
import { createRule } from '@ts-unify/eslint/internal'
import { skippedForPushToFilterMap } from '@ts-unify/rules'

import Tester from '../tester'

describe('skipped-for-push-to-filter-map.eslint', () => {
  Tester.run(
    createRule(skippedForPushToFilterMap, {
      message: 'Use .filter().map() instead of for-of with continue and push',
    }),
    'skipped-for-push-to-filter-map',
    {
      valid: [
        'const result = items.filter(x => x > 0).map(x => x * 2);',
        'function f() {\n  const out = [];\n  for (const x of xs) {\n' +
          '    if (x > 0) continue;\n    log(x);\n    out.push(x * 2);\n' +
          '  }\n}',
        'function f() {\n  const out = [];\n  for (const x of xs) {\n' +
          '    if (x > 0) return;\n    out.push(x * 2);\n  }\n}',
      ],
      invalid: [
        {
          code:
            'function f() {\n  const out: number[] = [];\n  for (const x ' +
            'of xs) {\n    if (x > 0) continue;\n    out.push(x * 2);\n' +
            '  }\n}',
          errors: [{ messageId: 'match' }],
          output:
            'function f() {\n    const out = xs.filter(x => !(x > 0)).map(x ' +
            '=> x * 2);\n}',
        },
        {
          code:
            'function f() {\n  const out = [];\n  for (const x of xs) {\n' +
            '    if (!p(x)) continue;\n    const y = g(x);\n' +
            '    out.push(y * 2);\n  }\n}',
          errors: [{ messageId: 'match' }],
          output:
            'function f() {\n    const out = xs.filter(x => p(x)).map(x ' +
            '=> {\n        const y = g(x);\n        return y * 2;\n    });\n}',
        },
      ],
    },
  )
})
