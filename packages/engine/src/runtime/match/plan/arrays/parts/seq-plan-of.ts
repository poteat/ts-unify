import Chain from '../../../chain'
import type { RewriteFactory } from '../../../rewrite-factory'
import type { SeqInfo } from '../../../seqs'
import type { SeqPlan } from './seq-plan'

/**
 * The plan of one seq of an expanded array pattern.
 *
 * @param seq where the seq landed, with its chain
 */
export const seqPlanOf = (seq: SeqInfo): SeqPlan => ({
  start: seq.start,
  length: seq.length,

  factory:
    (Chain.chainGet(seq.chain, 'to')?.args[0] as RewriteFactory | undefined) ||
    undefined,
})
