import * as rules from '@ts-unify/rules'
import { extractRuleMeta } from '@ts-unify/runner'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import Corpus from './corpus'
import Nodes from './nodes'
import Timing from './timing'

/**
 * The engine run over a repository's sources many times with no timing,
 * for a profiler to sample: how many matches were made and printed.
 *
 * @param root the repository root; this repository's by default
 * @param rounds how many times every rule runs over the corpus
 */
export function profileEngine(root: string | undefined, rounds: number) {
  const byType = Nodes.nodesByType(
    Corpus.parseCorpus(
      Corpus.sourceFiles(
        root ??
          path.resolve(
            path.dirname(fileURLToPath(import.meta.url)),
            '../../..',
          ),
      ),
    ),
  )
  const metas = Object.entries(rules).map(([name, t]) =>
    extractRuleMeta(name, t),
  )
  let matched = 0
  let printed = 0

  for (let round = 0; round < rounds; round++) {
    for (const meta of metas) {
      for (const record of Timing.matchRule(meta, byType, { count: 0 })) {
        matched++
        if (Timing.rewriteMatch(record).text !== null) printed++
      }
    }
  }

  return `${rounds} rounds: ${matched} matches, ${printed} printed`
}
