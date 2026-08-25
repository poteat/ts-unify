import type { RootLiteral } from '@engine/runtime/match'
/**
 * One entry as the tree is built: the entry, and the root literals of its
 * pattern the tree has not read yet.
 */
export type Row<E> = { entry: E; literals: readonly RootLiteral[] }
