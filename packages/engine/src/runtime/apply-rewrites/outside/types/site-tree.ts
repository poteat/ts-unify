/**
 * The positions of a match's inner sites as a tree over their paths: a
 * segment leads to the tree below it, or to null where a site ends.
 */
export type SiteTree = Map<string | number, SiteTree | null>
