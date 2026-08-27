import type { PluginConfigs } from '@ts-unify/eslint/create-plugin/configs'
import type { RuleModule } from '@ts-unify/eslint/rule-module'

/**
 * An ESLint plugin as `createPlugin` builds it: the rule modules by
 * kebab name, and its configs.
 */
export type Plugin = {
  rules: Record<string, RuleModule>
  configs: PluginConfigs
}
