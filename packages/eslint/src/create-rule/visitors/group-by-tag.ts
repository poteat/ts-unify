import type { PatternEntry } from '@ts-unify/engine'

/**
 * Entries by tag, in first-seen order.
 *
 * Entries sharing a tag (two same-typed branches of a root `U.or`) share
 * one visitor; like `U.or`, the first entry to match wins.
 *
 * @param entries the rule's entry patterns
 * @returns each tag to its entries, in the order given
 */
export function groupByTag(
  entries: readonly PatternEntry[],
): ReadonlyMap<string, readonly PatternEntry[]> {
  const byTag = new Map<string, readonly PatternEntry[]>()

  for (const entry of entries) {
    byTag.set(entry.tag, [...(byTag.get(entry.tag) ?? []), entry])
  }

  return byTag
}
