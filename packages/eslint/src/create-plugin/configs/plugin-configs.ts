import Recommended from './recommended'

/**
 * The configs a plugin ships: `recommended` alone.
 *
 * @param recommendedRules each recommended rule by its qualified name, with
 *   its level
 */
export const pluginConfigs = (recommendedRules: Record<string, string>) => ({
  recommended: Recommended.recommendedConfig(recommendedRules),
})
