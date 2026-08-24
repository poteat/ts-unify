import type { ParsedFile } from '../corpus'
import { walkNodes } from './walk-nodes'

/**
 * Every node of the corpus grouped by its `type`, each in visit order,
 * so a rule's entry pattern is tried against the nodes its tag names.
 *
 * @param corpus the parsed files
 */
export function nodesByType(
  corpus: readonly ParsedFile[],
): ReadonlyMap<string, readonly object[]> {
  const nodes = corpus.flatMap(it => walkNodes(it.program))
  const kindOf = (node: object) => (node as { type: string }).type

  return new Map(
    Array.from(new Set(nodes.map(kindOf)), kind => [
      kind,
      nodes.filter(node => kindOf(node) === kind),
    ]),
  )
}
