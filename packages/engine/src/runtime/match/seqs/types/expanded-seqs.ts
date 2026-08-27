import type { SeqInfo } from './landings'

/**
 * An array pattern with every `U.seq()` proxy replaced by its
 * constituents, and where each seq landed, for its inline rewrite.
 */
export type ExpandedSeqs = {
  expanded: unknown[]
  seqs: SeqInfo[]
}
