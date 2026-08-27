import type { RootLiteral } from '@ts-unify/engine/runtime/match/literals/types'
/**
 * A root literal at a path, allowing the values given.
 *
 * @param path the path under the node
 * @param values the values the pattern allows there
 * @returns a root literal keyed by the dotted path, holding the path and values
 */
export const literalAt = (
  path: readonly string[],
  values: readonly unknown[],
): RootLiteral => ({ key: path.join('.'), path, values })
