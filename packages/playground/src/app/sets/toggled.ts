/**
 * The set with one item flipped: removed when it is in, added when not.
 *
 * @param items the set, left as it is
 * @param item the item
 * @returns a new set
 */
export const toggled = (items: ReadonlySet<string>, item: string) =>
  items.has(item)
    ? new Set([...items].filter(kept => kept !== item))
    : new Set([...items, item])
