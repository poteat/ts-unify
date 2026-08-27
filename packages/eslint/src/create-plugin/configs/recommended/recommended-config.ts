/**
 * What a plugin's `configs.recommended` holds: its rule settings.
 *
 * @param rules each recommended rule by its qualified name, with its level
 * @returns an object whose `rules` is the settings given
 */
export const recommendedConfig = (rules: Record<string, string>) => ({
  rules,
})
