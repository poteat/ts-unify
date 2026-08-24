/**
 * Where a path ends: the container holding its last segment and that
 * segment's key; both null for an empty or broken path.
 */
export type Located = {
  parent: Record<string, unknown> | unknown[] | null
  key: string | number | null
}
