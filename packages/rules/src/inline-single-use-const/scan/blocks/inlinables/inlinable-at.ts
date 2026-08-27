import type {
  Inlinable,
  Tally,
} from '@ts-unify/rules/inline-single-use-const/scan/types'

import Moves from './moves'
import type { CandidateAt } from './types'

/**
 * The const at a statement as an inlinable, or null.
 *
 * Its name is read once after it, in the next statement, never rebound
 * or named in a type, and the initializer can take the read's place.
 *
 * @param candidate the const at its place in the block
 * @param tally the name's tally over the statements after it
 * @param nextEffectEnd the earliest end of an effect in the next statement
 * @returns the inlinable: index, name, init and read node; null when any
 *          condition fails
 */
export function inlinableAt(
  candidate: CandidateAt,
  tally: Tally | undefined,
  nextEffectEnd: number,
): Inlinable | null {
  if (!tally || tally.rebinds || tally.typeNamed || tally.read === null) {
    return null
  }

  const { read } = tally
  const canInline =
    read.statement === candidate.index + 1 &&
    !Moves.moves(read, candidate.init, nextEffectEnd)

  return canInline ? { ...candidate, read: read.node } : null
}
