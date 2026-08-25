import type { ReadEvent } from '@ts-unify/rules/inline-single-use-const/scan/frames'

/**
 * What the statements scanned so far do with one name: whether any binds
 * it again, whether a type position names it, how many reads it has, and
 * the read when there is exactly one.
 */
export type Tally = {
  rebinds: boolean
  typeNamed: boolean
  reads: number
  read: ReadEvent | null
}
