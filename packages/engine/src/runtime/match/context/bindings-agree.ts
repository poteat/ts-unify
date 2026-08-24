import type { NamedBinding } from './named-binding'
import Sub from '../../sub'

/**
 * Whether every name bound more than once was bound to equal values.
 *
 * @param bindings the named captures of a match, in match order
 */
export function bindingsAgree(bindings: readonly NamedBinding[]) {
  const seen: Record<string, unknown> = {}

  for (const { name, value } of bindings) {
    if (name in seen) {
      if (!Sub.deepEqual(seen[name], value)) return false
    } else {
      seen[name] = value
    }
  }

  return true
}
