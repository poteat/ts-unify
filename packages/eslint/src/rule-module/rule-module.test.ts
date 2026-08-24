import { U, $ } from '@ts-unify/core'
import type { RuleTester } from 'eslint'

import CreateRule from '../create-rule'

/**
 * The rule type `RuleTester.run` accepts.
 */
type TesterRule = Parameters<RuleTester['run']>[1]

const id = U.Identifier({ name: $('n') })

describe('RuleModule', () => {
  it('is the rule type RuleTester.run takes', () => {
    const rule: TesterRule = CreateRule.createRule(id)
    expect(rule.meta?.type).toBe('suggestion')
  })
})
