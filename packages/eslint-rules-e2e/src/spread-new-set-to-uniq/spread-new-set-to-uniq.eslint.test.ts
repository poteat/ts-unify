/**
 * spreadNewSetToUniq compiled by createRule and driven through ESLint's
 * RuleTester over the cases below.
 *
 * @scenario
 */
import { createRule } from '@ts-unify/eslint/internal'
import { spreadNewSetToUniq } from '@ts-unify/rules'

import Tester from '../tester'

describe('spread-new-set-to-uniq.eslint', () => {
  Tester.run(
    'spread-new-set-to-uniq',
    createRule(spreadNewSetToUniq, {
      message: 'Use uniq() instead of [...new Set()]',
      canFix: true,
    }),
    {
      valid: [
        'const x = new Set(arr);',
        'const x = [...arr];',
        'const x = Array.from(new Set(arr));',
      ],
      invalid: [
        {
          code: 'const x = [...new Set(arr)];',
          errors: [{ messageId: 'match' }],
          output: 'import { uniq } from "lodash";\nconst x = uniq(arr);',
        },
      ],
    },
  )
})
