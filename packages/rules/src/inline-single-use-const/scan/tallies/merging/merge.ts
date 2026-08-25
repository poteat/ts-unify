import Frames from '@ts-unify/rules/inline-single-use-const/scan/frames'
import type {
  Frame,
  Suppressed,
} from '@ts-unify/rules/inline-single-use-const/scan/frames'
import type {
  Analysis,
  Tally,
} from '@ts-unify/rules/inline-single-use-const/scan/types'

/**
 * Adds a nested block's tallies to the tallies of the block above it; a
 * read kept from the nested block continues its chain at the block's
 * frame and sits in the statement holding the block.
 *
 * @param tallies the tallies, written to
 * @param nested the nested block's analysis
 * @param frame the nested block's frame
 * @param statement the index of the statement holding the nested block
 * @param suppressed the names whose reads do not count here
 */
export function merge(
  tallies: Map<string, Tally>,
  nested: Analysis,
  frame: Frame,
  statement: number,
  suppressed: Suppressed | null,
) {
  for (const [name, inner] of nested.tallies) {
    const tally = tallies.get(name) ?? {
      rebinds: false,
      typeNamed: false,
      reads: 0,
      read: null,
    }
    tallies.set(name, tally)
    if (inner.rebinds) tally.rebinds = true
    if (inner.typeNamed) tally.typeNamed = true
    if (inner.reads === 0 || Frames.isSuppressed(suppressed, name)) continue
    tally.reads += inner.reads
    const { read } = inner
    tally.read =
      tally.reads === 1 && read
        ? { ...read, beyond: [...read.beyond, frame], statement }
        : null
  }
}
