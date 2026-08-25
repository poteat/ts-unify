import Kinds from '@ts-unify/rules/inline-single-use-const/reads/kinds'
import Tree from '@ts-unify/rules/inline-single-use-const/reads/tree'
import Frames from '@ts-unify/rules/inline-single-use-const/scan/frames'
import type { ReadEvent } from '@ts-unify/rules/inline-single-use-const/scan/frames'

import Branches from './branches'

/**
 * Whether putting the initializer at a read changes when it runs or how
 * the statement reads.
 *
 * True for a read in a nested function, a loop, a shorthand property or a
 * template literal's hole (a fragment keeps its name); and for an
 * initializer with effects, a read after another effect or under a branch.
 *
 * @param read the one read of the name
 * @param init the initializer
 * @param effectEnd the earliest end of an effect in the read's statement
 */
export function moves(read: ReadEvent, init: Tree.Node, effectEnd: number) {
  const parent = read.frame.up?.node
  if (parent?.type === 'Property' && parent.shorthand) return true
  if (parent?.type === 'TemplateLiteral') return true

  for (const node of Frames.above(read)) {
    if (Kinds.FUNCTIONS.has(node.type) || Kinds.LOOPS.has(node.type)) {
      return true
    }
  }

  if (![...Tree.walk(init)].some(([n]) => Kinds.EFFECTS.has(n.type))) {
    return false
  }

  const [start] = read.node.range as [number, number]
  if (effectEnd <= start) return true

  for (const [node, below] of Frames.pairs(read)) {
    if (Branches.isBranch(node, below)) return true
  }

  return false
}
