/**
 * objectAssignToSpread compiled by createRule and driven through ESLint's
 * RuleTester over the cases below.
 *
 * @scenario
 */
import { createRule } from '@ts-unify/eslint/internal'
import { objectAssignToSpread } from '@ts-unify/rules'

import Tester from '../tester'

describe('object-assign-to-spread.eslint', () => {
  Tester.run(
    createRule(objectAssignToSpread, {
      message: 'Use object spread instead of Object.assign',
    }),
    'object-assign-to-spread',
    {
      valid: [
        'const x = { ...a, ...b };',
        'Object.assign(target, source);',
        'Object.create({});',
        'Reflect.assign({}, a);',
      ],
      invalid: [
        {
          code: 'const x = Object.assign({}, a, b);',
          errors: [{ messageId: 'match' }],
          output: 'const x = {\n    ...a,\n    ...b\n};',
        },
        {
          code: 'const x = Object.assign({}, source);',
          errors: [{ messageId: 'match' }],
          output: 'const x = {\n    ...source\n};',
        },
      ],
    },
  )
})
