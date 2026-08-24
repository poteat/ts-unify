import {
  $,
  REST_CAPTURE,
  isStringPredicate,
  testString,
} from '@ts-unify/core/internal'

import type { Bag } from '../bag'
import Context from '../context'
import Pattern from '../pattern'
import { matchArrayInner } from './match-array-inner'
import { matchProxyNode } from './match-proxy-node'

/**
 * Matches a node against a fields record, one property at a time, and
 * returns the captures, or null on mismatch.
 *
 * A bare `$` as the whole pattern captures every structural property of
 * the node; a pattern built with `{ ...$ }` captures the properties it did
 * not name.
 *
 * @param node the node
 * @param pattern the fields record, or `$`
 * @param at where the node sits in the match
 */
export function matchInner(
  node: unknown,
  pattern: unknown,
  at: Context.Cursor,
): Bag | null {
  if (pattern === $) return Context.captureRest(node, at, new Set())
  if (node === null || typeof node !== 'object') return null

  const bag: Bag = {}
  const nodeRec = node as Record<string, unknown>
  const patternRec = pattern as Record<string | symbol, unknown>

  for (const [key, expected] of Object.entries(patternRec)) {
    const actual = nodeRec[key]
    const childAt = Context.childCursor(at, key)

    if (expected === $) {
      bag[key] = actual
      at.ctx.capturePaths[key] = childAt.path
      continue
    }

    if (Pattern.isCapture(expected)) {
      bag[expected.name] = actual
      at.ctx.bind(expected.name, actual)
      at.ctx.capturePaths[expected.name] = childAt.path
      continue
    }

    if (Pattern.isConfigSlot(expected)) {
      if (actual !== at.ctx.configDefaults[expected.name]) return null

      continue
    }

    if (isStringPredicate(expected)) {
      if (!testString(expected, actual)) return null
      continue
    }

    if (Pattern.isProxyNode(expected)) {
      const proxyBag = matchProxyNode(actual, expected, childAt)
      if (!proxyBag) return null
      Object.assign(bag, proxyBag)
      continue
    }

    if (typeof expected === 'object' && expected && !Array.isArray(expected)) {
      const innerBag = matchInner(actual, expected, childAt)
      if (!innerBag) return null
      Object.assign(bag, innerBag)
      continue
    }

    if (Array.isArray(expected)) {
      if (!Array.isArray(actual)) return null
      const arrayBag = matchArrayInner(actual, expected, childAt)
      if (!arrayBag) return null
      Object.assign(bag, arrayBag)
      continue
    }

    if (actual !== expected) return null
  }

  return patternRec[REST_CAPTURE]
    ? {
        ...bag,
        ...Context.captureRest(node, at, new Set(Object.keys(patternRec))),
      }
    : bag
}
