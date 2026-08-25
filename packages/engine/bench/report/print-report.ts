import type { RuleTiming } from '@bench/timing'

import Rates from './rates'
import Tables from './tables'
/**
 * The benchmark's report: one line per rule, then the corpus totals as
 * rates.
 *
 * @param timings the rule timings
 * @param corpus how many files and nodes the corpus holds
 */
export function printReport(
  timings: readonly RuleTiming[],
  corpus: { files: number; nodes: number },
): string {
  const rows = timings.map(t => [
    t.rule,
    t.tags.join(','),
    t.tried,
    t.admitted,
    t.matched,
    t.matchMs,
    t.guardMs,
    t.rewritten,
    t.rewriteMs,
    t.extractUs,
    t.createRuleUs,
  ])
  const sum = (pick: (t: RuleTiming) => number) =>
    timings.reduce((n, t) => n + pick(t), 0)
  const tried = sum(t => t.tried)
  const admitted = sum(t => t.admitted)
  const matched = sum(t => t.matched)
  const matchMs = sum(t => t.matchMs)
  const guardMs = sum(t => t.guardMs)
  const engineMs = matchMs - guardMs
  const rewritten = sum(t => t.rewritten)
  const rewriteMs = sum(t => t.rewriteMs)
  const setupUs = sum(t => t.extractUs + t.createRuleUs)

  return [
    Tables.formatTable(
      [
        'rule',
        'tags',
        'tried',
        'admitted',
        'matched',
        'match ms',
        'guard ms',
        'rewritten',
        'rewrite ms',
        'extract us',
        'createRule us',
      ],
      rows,
    ),
    '',
    `corpus: ${corpus.files} files, ${corpus.nodes} nodes`,
    `match: ${tried} tries, ${admitted} admitted, ${matched} matches` +
      ` in ${matchMs.toFixed(1)} ms (${Rates.rate(tried, matchMs)} tries/s);` +
      ` ${guardMs.toFixed(1)} ms of it in the rules' own guards,` +
      ` ${engineMs.toFixed(1)} ms in the engine` +
      ` (${Rates.rate(tried, engineMs)} tries/s)`,
    `rewrite: ${rewritten} printed in ${rewriteMs.toFixed(1)} ms` +
      ` (${Rates.rate(rewritten, rewriteMs)} rewrites/s)`,
    `setup: ${setupUs.toFixed(0)} us for all rules`,
  ].join('\n')
}
