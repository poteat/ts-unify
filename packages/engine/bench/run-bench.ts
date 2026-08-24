import * as rules from '@ts-unify/rules'
import { extractRuleMeta } from '@ts-unify/runner'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import Corpus from './corpus'
import Nodes from './nodes'
import Report from './report'
import Timing from './timing'

/**
 * The benchmark's report over a repository's sources.
 *
 * The match of every rule's entry patterns against every node of their
 * tags, the rewrite and print of every match, and the setup of every rule.
 *
 * @param root the repository root; this repository's by default
 */
export function runBench(root?: string): string {
  const corpus = Corpus.parseCorpus(
    Corpus.sourceFiles(
      root ??
        path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..'),
    ),
  )
  const byType = Nodes.nodesByType(corpus)

  return Report.printReport(
    Timing.timeRules(
      Object.entries(rules).map(([name, transform]) => ({
        meta: extractRuleMeta(name, transform),
        transform,
      })),
      byType,
    ),
    {
      files: corpus.length,
      nodes: [...byType.values()].reduce((n, list) => n + list.length, 0),
    },
  )
}
