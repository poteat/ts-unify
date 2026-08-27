import type { ParsedFile } from '@bench/corpus'

import Kinds from './kinds'
import Walk from './walk'
/**
 * Every node of the corpus grouped by its `type`, each in visit order,
 * so a rule's entry pattern is tried against the nodes its tag names.
 *
 * @param corpus the parsed files
 * @returns each node `type` to its nodes in visit order
 */
export function nodesByType(
  corpus: readonly ParsedFile[],
): ReadonlyMap<string, readonly object[]> {
  const nodes = corpus.flatMap(it => Walk.walkNodes(it.program))

  return new Map(
    Array.from(new Set(nodes.map(Kinds.kindOf)), kind => [
      kind,
      nodes.filter(node => Kinds.kindOf(node) === kind),
    ]),
  )
}
