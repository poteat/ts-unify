import Chain from '@ts-unify/engine/runtime/match/chain'
import type { SeqPlan } from '@ts-unify/engine/runtime/match/plan/arrays/types'
import type { SeqInfo } from '@ts-unify/engine/runtime/match/seqs'
import type { RewriteFactory } from '@ts-unify/engine/runtime/match/types'
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
