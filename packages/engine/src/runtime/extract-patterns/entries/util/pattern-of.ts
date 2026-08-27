import type { ProxyNode } from '@ts-unify/core/internal'

/**
 * The fields record a builder call was given, as its proxy node recorded
 * it; an empty record for a call with no argument, such as `U.Identifier()`.
 *
 * @param node the proxy node
 * @returns the call's first argument as a record, or an empty record without
 *          one
 */
export const patternOf = (node: ProxyNode): Record<string, unknown> =>
  (node.args[0] ?? {}) as Record<string, unknown>
