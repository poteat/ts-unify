import type { Cursor } from '@ts-unify/engine/runtime/match/context'
import type { CountPlan } from '@ts-unify/engine/runtime/match/plan'
/**
 * One count in progress: what is counted, and the cursor the matches
 * are made under.
 */
export type Count = { plan: CountPlan; at: Cursor }
