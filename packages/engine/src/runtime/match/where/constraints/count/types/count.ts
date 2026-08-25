import type { Cursor } from '@engine/runtime/match/context'
import type { CountPlan } from '@engine/runtime/match/plan'
/**
 * One count in progress: what is counted, and the cursor the matches
 * are made under.
 */
export type Count = { plan: CountPlan; at: Cursor }
