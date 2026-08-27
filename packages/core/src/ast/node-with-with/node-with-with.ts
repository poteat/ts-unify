import type { FluentNode } from '@/ast/fluent-node'
import type { NormalizeBag } from '@/ast/normalize-bag'
import type { OverwriteBag } from '@/ast/overwrite-bag'
import type { SubstituteCaptures } from '@/ast/substitute-captures'
import type { ExtractCaptures } from '@/pattern'
import type { Overwrite } from '@/type-utils'

import type { WithBranded } from './types'

/**
 * Adds a fluent `.with` that merges a new bag into the capture bag: a
 * colliding key takes the new entry's type, a new key is added.
 *
 * The added keys ride on the `__with` brand, so a downstream `.to` sees
 * them.
 */
export type NodeWithWith<Node> = Node & {
  /**
   * Merges the bag the callback returns into the capture bag.
   *
   * @param fn computes the new entries from the captures of a match
   * @returns the node with the merged bag, the new keys riding on `__with`
   */
  with<NewBag>(
    fn: (bag: ExtractCaptures<Node>) => NewBag,
  ): FluentNode<
    SubstituteCaptures<Omit<Node, '__with'>, OverwriteBag<Node, NewBag>> &
      WithBranded<
        Node extends WithBranded<infer WB>
          ? Overwrite<WB, NormalizeBag<NewBag>>
          : OverwriteBag<Node, NewBag>
      >
  >
}
