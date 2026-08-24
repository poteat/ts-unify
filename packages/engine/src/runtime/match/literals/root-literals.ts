import Plan from '../plan'
import { buildRootLiterals } from './build-root-literals'

/**
 * What each pattern object requires under a node, kept by the pattern.
 */
export const rootLiterals = Plan.planMemo(buildRootLiterals)
