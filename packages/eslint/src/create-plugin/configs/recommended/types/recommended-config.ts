/**
 * What a plugin's `configs.recommended` holds: each recommended rule by
 * its qualified name, with its level.
 */
export type RecommendedConfig = { rules: Record<string, string> }
