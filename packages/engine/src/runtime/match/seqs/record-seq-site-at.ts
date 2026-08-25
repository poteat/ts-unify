import Chain from '@ts-unify/engine/runtime/match/chain'
import type { Cursor } from '@ts-unify/engine/runtime/match/context'
import type { RewriteFactory } from '@ts-unify/engine/runtime/match/types'
import type { Bag } from '@ts-unify/engine/runtime/types'

import type { SeqInfo } from './types'
/**
 * Records a seq's `.to()` factory as a rewrite site spanning the seq's
 * elements; nothing happens for a seq whose chain has no `.to()` factory.
 *
 * @param seq the seq
 * @param at the cursor of the array element the seq starts at
 * @param bag the captures the site's factory reads
 */
export function recordSeqSiteAt(seq: SeqInfo, at: Cursor, bag: Bag) {
  const factory = Chain.chainGet(seq.chain, 'to')?.args[0]
  if (!factory) return
  at.ctx.recordSite({
    path: at.path,
    factory: factory as RewriteFactory,
    scopeBag: bag,
    span: seq.length,
  })
}
