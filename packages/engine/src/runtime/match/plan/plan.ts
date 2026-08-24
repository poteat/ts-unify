import type { FieldsPlan } from './fields'
import type { ProxyPlan } from './proxies'
import type {
  CapturePlan,
  ConfigPlan,
  DollarPlan,
  LiteralPlan,
  StringPlan,
} from './values'

/**
 * What a pattern value asks of the value at its position, read once from
 * the pattern so a match reads no brands and no proxies.
 *
 * An array is a fields record here, its indices the keys; it is an array
 * pattern under a property of a fields record, see `FieldPlan`.
 */
export type Plan =
  | DollarPlan
  | CapturePlan
  | ConfigPlan
  | StringPlan
  | ProxyPlan
  | FieldsPlan
  | LiteralPlan
