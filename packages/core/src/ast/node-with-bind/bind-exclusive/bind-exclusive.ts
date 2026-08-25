import type { SubstituteCaptures } from '@/ast/substitute-captures'

import type { BindBagEntries } from './types'

/**
 * The node after `.bind(name)`: its captures rewritten against the bind
 * bag, and `__only` set so that bag alone reaches `.to()`.
 */
export type BindExclusive<Node, Name extends string> = SubstituteCaptures<
  Omit<Node, '__with' | '__only'>,
  BindBagEntries<Node, Name>
> & {
  readonly __only: BindBagEntries<Node, Name>
}
