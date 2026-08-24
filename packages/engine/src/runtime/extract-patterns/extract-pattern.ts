import { extractPatterns } from './extract-patterns'
import type { PatternEntry } from './pattern-entry'

/**
 * The first entry pattern of a rule's proxy trace, or null when the
 * rule has none.
 *
 * @param rule the rule's pattern proxy
 */
export const extractPattern = (rule: unknown): PatternEntry | null =>
  extractPatterns(rule)[0] ?? null
