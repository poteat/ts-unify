import type { Cursor } from '../../context'
import type { CountPlan } from '../../plan'

/**
 * One count in progress: what is counted, and the cursor the matches
 * are made under.
 */
export type Count = { plan: CountPlan; at: Cursor }
