import type { FieldsPlan } from '../../fields'
import type { DollarPlan } from '../../values'

/**
 * The body of a node proxy such as `U.Identifier({ ... })`: the plan of
 * its fields record, or a bare `$` capturing every structural property.
 */
export type NodeBody = { shape: 'node'; fields: FieldsPlan | DollarPlan }
