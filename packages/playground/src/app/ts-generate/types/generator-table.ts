import type { Generator, State } from 'astring'

import type { GeneratorNode } from './node'

/**
 * An astring generator with a method per TypeScript node type beside the
 * ESTree ones, so a method may dispatch on any node's `type`.
 */
export type GeneratorTable = Generator & {
  readonly [kind: string]: (
    this: GeneratorTable,
    node: GeneratorNode,
    state: State,
  ) => void
}
