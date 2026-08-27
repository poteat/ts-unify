import Entries from './entries'
import type { PatternEntry } from './entries'
/**
 * The first entry pattern of a rule's proxy trace, or null when the
 * rule has none.
 *
 * @param rule the rule's pattern proxy
 * @returns the first entry, or null when the rule yields none
 */
export const extractPattern = (rule: unknown): PatternEntry | null =>
  Entries.extractPatterns(rule)[0] ?? null
