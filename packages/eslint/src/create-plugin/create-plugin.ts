import CreateRule from '@ts-unify/eslint/create-rule'
import type { RuleModule } from '@ts-unify/eslint/rule-module'
import type { TransformLike } from '@ts-unify/eslint/transform-like'
import { kebabCase } from '@ts-unify/runner'

import Configs from './configs'

/**
 * Create an ESLint plugin from a map of rule names to AstTransform values.
 *
 * @param rules each rule's transform by its export name
 * @param opts `prefix`, the plugin name a recommended rule is qualified
 *   with (`ts-unify` when absent)
 */
export function createPlugin(
  rules: Record<string, TransformLike>,
  opts: { prefix?: string } = {},
): {
  rules: Record<string, RuleModule>
  configs: { recommended: { rules: Record<string, string> } }
} {
  const prefix = opts.prefix ?? 'ts-unify'
  const ruleModules: Record<string, RuleModule> = {}
  const recommendedRules: Record<string, string> = {}

  for (const [name, transform] of Object.entries(rules)) {
    const kebab = kebabCase(name)
    ruleModules[kebab] = CreateRule.createRule(transform)

    if (Configs.isRecommended(transform)) {
      recommendedRules[`${prefix}/${kebab}`] = 'warn'
    }
  }

  return {
    rules: ruleModules,
    configs: Configs.pluginConfigs(recommendedRules),
  }
}
