import { applyRewrites, matchWithSites } from '@ts-unify/engine'
import { rootSites } from '@ts-unify/runner'

import PrintNode from '../../../../eslint/src/print-node'
import type { MatchRecord } from './match-record'

/**
 * The printed rewrite of one match, as the ESLint adapter's fix builds
 * it, and the milliseconds the rewrite and its print took.
 *
 * The match is made afresh first, outside the time. Null for a match
 * whose rule carries no rewrite, or whose rewrite does not print.
 *
 * @param record the match
 */
export function rewriteMatch(record: MatchRecord): {
  text: string | null
  ms: number
} {
  const result = matchWithSites(
    record.node,
    record.entry.pattern,
    record.entry.chain,
  )
  if (!result) return { text: null, ms: 0 }
  const start = performance.now()
  const sites = rootSites(result, record.rule.factory)
  if (sites.length === 0) return { text: null, ms: 0 }

  try {
    const text = PrintNode.printNode(
      applyRewrites(record.node, sites, result.capturePaths),
    )

    return { text, ms: performance.now() - start }
  } catch {
    return { text: null, ms: 0 }
  }
}
