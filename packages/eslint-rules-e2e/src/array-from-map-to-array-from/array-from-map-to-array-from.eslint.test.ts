/**
 * arrayFromMapToArrayFrom compiled by createRule and driven through ESLint's
 * RuleTester over the cases below.
 *
 * @scenario
 */
import { createRule } from '@ts-unify/eslint/internal'
import { arrayFromMapToArrayFrom } from '@ts-unify/rules'

import Tester from '../tester'

describe('array-from-map-to-array-from.eslint', () => {
  Tester.run(
    'array-from-map-to-array-from',
    createRule(arrayFromMapToArrayFrom, {
      message:
        'Use Array.from(iterable, mapFn) instead of ' +
        'Array.from(iterable).map(mapFn)',
    }),
    {
      valid: [
        'Array.from(items, x => x + 1);',
        'Array.from(items);',
        'items.map(x => x + 1);',
        'Array.from(items).filter(x => x > 0);',
        'List.from(items).map(x => x);',
      ],
      invalid: [
        {
          code: 'Array.from(items).map(x => x + 1);',
          errors: [{ messageId: 'match' }],
          output: 'Array.from(items, x => x + 1);',
        },
        {
          code: 'Array.from(set).map(transform);',
          errors: [{ messageId: 'match' }],
          output: 'Array.from(set, transform);',
        },
      ],
    },
  )
})
