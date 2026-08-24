import { U, $ } from '@ts-unify/core'
import type { RuleTester } from 'eslint'

import CreateRule from '../create-rule'

describe('rule-module', () => {
  type TesterRule = Parameters<RuleTester['run']>[1]
  const id = U.Identifier({ name: $('n') })

  it('is the rule type RuleTester.run takes', () => {
    const rule: TesterRule = CreateRule.createRule(id)
    expect(rule.meta?.type).toBe('suggestion')
  })
})
