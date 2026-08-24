import type { State } from 'astring'

import type { GeneratorNode } from '../generator-node'
import type { GeneratorTable } from '../generator-table'

/**
 * What {@link writeSeparated} writes: a list of nodes and the text between
 * each two, through a generator onto its state.
 */
export type SeparatedWrite = {
  readonly table: GeneratorTable
  readonly state: State
  readonly nodes: readonly GeneratorNode[]
  readonly separator: string
}
