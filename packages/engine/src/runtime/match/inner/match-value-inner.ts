import { $, isStringPredicate, testString } from '@ts-unify/core/internal'

import type { Bag } from '../bag'
import type { Cursor } from '../context'
import Pattern from '../pattern'
import { matchInner } from './match-inner'
import { matchProxyNode } from './match-proxy-node'

/**
 * Matches one value against one pattern value of any kind, and returns
 * the captures, or null on mismatch.
 *
 * The pattern value is a capture, a config slot, a string predicate, a
 * proxy node, a fields record, or a literal compared by identity. A bare
 * `$` captures under the cursor's key, or under `_` without one.
 *
 * @param actual the value
 * @param expected the pattern value
 * @param at where the value sits in the match
 */
export function matchValueInner(
  actual: unknown,
  expected: unknown,
  at: Cursor,
): Bag | null {
  if (expected === $) {
    if (at.key) at.ctx.capturePaths[at.key] = at.path

    return { [at.key || '_']: actual }
  }

  if (Pattern.isCapture(expected)) {
    at.ctx.bind(expected.name, actual)
    at.ctx.capturePaths[expected.name] = at.path

    return { [expected.name]: actual }
  }

  return Pattern.isConfigSlot(expected)
    ? actual === at.ctx.configDefaults[expected.name]
      ? {}
      : null
    : isStringPredicate(expected)
      ? testString(expected, actual)
        ? {}
        : null
      : Pattern.isProxyNode(expected)
        ? matchProxyNode(actual, expected, at)
        : typeof expected === 'object' && expected
          ? matchInner(actual, expected, at)
          : actual === expected
            ? {}
            : null
}
