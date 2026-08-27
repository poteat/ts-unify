import Reads from '@ts-unify/rules/inline-single-use-const/reads'
import type { Node } from '@ts-unify/rules/inline-single-use-const/reads/tree'
import Frames from '@ts-unify/rules/inline-single-use-const/scan/frames'
import type { Site } from '@ts-unify/rules/inline-single-use-const/scan/frames'
import type { Tally } from '@ts-unify/rules/inline-single-use-const/scan/types'

import Binds from './binds'

/**
 * Adds what one identifier does with its name to the tallies: a binding,
 * a type position, a read.
 *
 * @param tallies the tallies, written to
 * @param id the identifier
 * @param site where it stands: its frame, the index of the block's statement
 *             it sits in, and the names suppressed there
 */
export function record(tallies: Map<string, Tally>, id: Node, site: Site) {
  const { frame, statement } = site
  const name = id.name as string
  const parent = frame.up?.node
  const tally = tallies.get(name) ?? {
    rebinds: false,
    typeNamed: false,
    reads: 0,
    read: null,
  }
  tallies.set(name, tally)

  if (parent) {
    if (Binds.binds(id, parent, frame.up?.up?.node)) tally.rebinds = true
    if (parent.type.startsWith('TS')) tally.typeNamed = true
  }

  if (Reads.isRead(id, parent) && !Frames.isSuppressed(site, name)) {
    tally.reads += 1
    tally.read =
      tally.reads === 1 ? { node: id, frame, beyond: [], statement } : null
  }
}
