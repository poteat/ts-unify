import Recommended from './recommended'

/**
 * The configs a plugin ships: `recommended` alone.
 *
 * @param recommendedRules each recommended rule by its qualified name, with
 *   its level
 * @returns an object whose `recommended` is the config over those rules
 */
export const pluginConfigs = (recommendedRules: Record<string, string>) => ({
  recommended: Recommended.recommendedConfig(recommendedRules),
})
