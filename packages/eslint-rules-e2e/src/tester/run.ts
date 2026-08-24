import type { RuleModule } from '@ts-unify/eslint'
import * as parser from '@typescript-eslint/parser'
import { RuleTester } from '@typescript-eslint/rule-tester'
import type { RunTests } from '@typescript-eslint/rule-tester'

/**
 * A rule's cases under ESLint's RuleTester with the TypeScript parser, one
 * tester per call.
 *
 * The rule is what createRule built; the cast bridges ts-unify's rule
 * shape and typescript-eslint's.
 *
 * @param name the rule's name, the describe the tester opens
 * @param rule the rule
 * @param cases the valid sources, and the invalid ones with their reports
 */
export const run = (
  name: string,
  rule: RuleModule,
  cases: RunTests<string, readonly unknown[]>,
) =>
  new RuleTester({ languageOptions: { parser } }).run(
    name,
    rule as unknown as Parameters<RuleTester['run']>[1],
    cases,
  )
