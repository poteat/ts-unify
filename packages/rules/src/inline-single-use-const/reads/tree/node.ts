/**
 * A parser node as the walk sees it: its kind, and whatever else the
 * parser put on it.
 */
export type Node = { type: string; [k: string]: unknown }
