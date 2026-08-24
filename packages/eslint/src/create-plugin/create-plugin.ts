import CreateRule from '../create-rule'
import type { RuleModule } from '../rule-module'
import type { TransformLike } from '../transform-like'
import { isRecommended } from './is-recommended'
import { pluginConfigs } from './plugin-configs'
import { toKebab } from './to-kebab'

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
    const kebab = toKebab(name)
    ruleModules[kebab] = CreateRule.createRule(transform)

    if (isRecommended(transform)) {
      recommendedRules[`${prefix}/${kebab}`] = 'warn'
    }
  }

  return { rules: ruleModules, configs: pluginConfigs(recommendedRules) }
}
