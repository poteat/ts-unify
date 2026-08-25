import type {
  Inlinable,
  Tally,
} from '@ts-unify/rules/inline-single-use-const/scan/types'

import Moves from './moves'

/**
 * The const at a statement as an inlinable, or null: its name is read
 * once after it, in the next statement, never rebound or named in a type,
 * and the initializer can take the read's place.
 *
 * @param index the statement's index in the block
 * @param name the const's name
 * @param init its initializer
 * @param tally the name's tally over the statements after it
 * @param nextEffectEnd the earliest end of an effect in the next statement
 */
export function inlinableAt(
  index: number,
  name: string,
  init: Inlinable['init'],
  tally: Tally | undefined,
  nextEffectEnd: number,
): Inlinable | null {
  if (!tally || tally.rebinds || tally.typeNamed || tally.read === null)
    return null
  const { read } = tally

  return read.statement === index + 1 && !Moves.moves(read, init, nextEffectEnd)
    ? { index, name, init, read: read.node }
    : null
}
