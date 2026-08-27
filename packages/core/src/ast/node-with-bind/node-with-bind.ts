import type { FluentNode } from '@/ast/fluent-node'
import type { Sealed } from '@/ast/sealed'

import type { BindExclusive } from './bind-exclusive'

/**
 * Adds a fluent `.bind` that captures the whole subtree under one name.
 * Either form clears the existing capture bag first.
 */
export type NodeWithBind<Node> = Node & {
  /**
   * Captures the whole subtree under the given name, dropping the
   * captures the node contributed.
   *
   * Called with no name, it binds as `node` and seals.
   *
   * @param name the bag key the subtree lands under
   * @returns the node with the whole subtree captured under `name`, its own
   *          captures dropped
   */
  bind<const S extends string>(name: S): FluentNode<BindExclusive<Node, S>>

  /**
   * Zero-arg sugar: capture the whole subtree under the canonical `"node"`
   * name, seal the subtree, and clear the capture bag.
   */
  bind(): FluentNode<Sealed<BindExclusive<Node, 'node'>>>
}
