import Reads from '../../reads'
import type { Node } from '../../reads/tree'
import Frames from '../frames'
import type { Frame, Suppressed } from '../frames'
import { binds } from './binds'
import type { Tally } from './tally'

/**
 * Adds what one identifier does with its name to the tallies: a binding,
 * a type position, a read.
 *
 * @param id the identifier
 * @param frame its frame
 * @param statement the index of the block's statement it sits in
 * @param tallies the tallies, written to
 * @param suppressed the names whose reads do not count here
 */
export function record(
  id: Node,
  frame: Frame,
  statement: number,
  tallies: Map<string, Tally>,
  suppressed: Suppressed | null,
) {
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
    if (binds(id, parent, frame.up?.up?.node)) tally.rebinds = true
    if (parent.type.startsWith('TS')) tally.typeNamed = true
  }

  if (Reads.isRead(id, parent) && !Frames.isSuppressed(suppressed, name)) {
    tally.reads += 1
    tally.read =
      tally.reads === 1 ? { node: id, frame, beyond: [], statement } : null
  }
}
