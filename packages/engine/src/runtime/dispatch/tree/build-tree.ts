import Literals from '@ts-unify/engine/runtime/match/literals'

import type { DecisionTree, Row } from './types'
import Util from './util'
/**
 * The decision tree over rows: a leaf of their entries when none holds
 * a literal left to read, else an inner node at the path most rows hold.
 *
 * A branch per value any row allows at the path holds the rows allowing
 * it or holding nothing there; `rest` holds the rows holding nothing
 * there. Each level consumes the path's literal of every row holding it.
 *
 * @param rows the entries with the literals not read yet, in order
 */
export function buildTree<E>(rows: readonly Row<E>[]): DecisionTree<E> {
  const key = Util.chooseKey(rows)

  if (key === null) {
    return { isLeaf: true, entries: rows.map(it => it.entry) }
  }

  const at = (row: Row<E>) => row.literals.filter(it => it.key === key)
  const without = (row: Row<E>): Row<E> => ({
    entry: row.entry,
    literals: row.literals.filter(it => it.key !== key),
  })
  const values = new Set(rows.flatMap(row => at(row).flatMap(it => it.values)))

  return Util.innerNode(
    rows.flatMap(at)[0].path,

    new Map(
      [...values].map(value => [
        value,

        buildTree(
          rows
            .filter(row => at(row).every(it => Literals.admits(it, value)))
            .map(without),
        ),
      ]),
    ),

    buildTree(rows.filter(row => at(row).length === 0)),
  )
}
