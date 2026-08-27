/**
 * The node a proxy matched and the key it sits under in its parent;
 * no key at the root.
 */
export type MatchedNode = { node: unknown; key?: string }
