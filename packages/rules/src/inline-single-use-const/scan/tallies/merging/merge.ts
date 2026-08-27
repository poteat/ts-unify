import Frames from '@ts-unify/rules/inline-single-use-const/scan/frames'
import type { Site } from '@ts-unify/rules/inline-single-use-const/scan/frames'
import type {
  Analysis,
  Tally,
} from '@ts-unify/rules/inline-single-use-const/scan/types'

/**
 * Adds a nested block's tallies to the tallies of the block above it.
 *
 * A read kept from the nested block continues its chain at the block's
 * frame and sits in the statement holding the block.
 *
 * @param tallies the tallies, written to
 * @param nested the nested block's analysis
 * @param site where the nested block stands: its frame, the index of the
 *             statement holding it, and the names suppressed there
 */
export function merge(
  tallies: Map<string, Tally>,
  nested: Analysis,
  site: Site,
) {
  const { frame, statement } = site

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
    if (inner.reads === 0 || Frames.isSuppressed(site, name)) continue
    tally.reads += inner.reads
    const { read } = inner
    const isSoleRead = tally.reads === 1 && read

    tally.read = isSoleRead
      ? { ...read, beyond: [...read.beyond, frame], statement }
      : null
  }
}
