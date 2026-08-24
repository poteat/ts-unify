import { NODE } from '@ts-unify/core/internal'
import type { ProxyNode, ChainEntry } from '@ts-unify/core/internal'
import { symGet } from '@ts-unify/engine'

import CreateRule from '../create-rule'
import type { RuleModule } from '../rule-module'
import type { TransformLike } from '../transform-like'

const toKebab = (name: string) =>
  name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

function isRecommended(transform: TransformLike) {
  const node = symGet(transform, NODE) as ProxyNode | undefined

  return (
    node?.chain?.some((c: ChainEntry) => c.method === 'recommended') ?? false
  )
}

/**
 * Create an ESLint plugin from a map of rule names to AstTransform values.
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

  return {
    rules: ruleModules,
    configs: { recommended: { rules: recommendedRules } },
  }
}
