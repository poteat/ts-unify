import type { ParsedFile } from '@bench/corpus'

import Walk from './walk'
/**
 * Every node of the corpus grouped by its `type`, each in visit order,
 * so a rule's entry pattern is tried against the nodes its tag names.
 *
 * @param corpus the parsed files
 */
export function nodesByType(
  corpus: readonly ParsedFile[],
): ReadonlyMap<string, readonly object[]> {
  const nodes = corpus.flatMap(it => Walk.walkNodes(it.program))
  const kindOf = (node: object) => (node as { type: string }).type

  return new Map(
    Array.from(new Set(nodes.map(kindOf)), kind => [
      kind,
      nodes.filter(node => kindOf(node) === kind),
    ]),
  )
}
