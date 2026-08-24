import type { BindNode } from './bind-node'

/**
 * Bind the capture names and value types of a pattern `P` against a
 * reference `Shape`.
 *
 * An implicit placeholder at key `K` becomes `Capture<K, Shape[K]>`; an
 * explicit `Capture<Name, V>` keeps `V`, or takes the shape's type at its
 * position when `V` is `unknown`. Objects, tuples and arrays recurse.
 *
 * @typeParam P pattern to bind
 * @typeParam Shape reference shape the pattern matches against
 */
export type BindCaptures<P, Shape> = BindNode<P, Shape, ''>
