import type { RootLiteral } from '../root-literal'

/**
 * A root literal at a path, allowing the values given.
 *
 * @param path the path under the node
 * @param values the values the pattern allows there
 */
export const literalAt = (
  path: readonly string[],
  values: readonly unknown[],
): RootLiteral => ({ key: path.join('.'), path, values })
