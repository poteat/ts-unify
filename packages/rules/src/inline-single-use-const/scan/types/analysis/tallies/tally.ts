import type { ReadEvent } from '@ts-unify/rules/inline-single-use-const/scan/frames'

/**
 * What the statements scanned so far do with one name: rebinding it,
 * naming it in a type, reading it, and the read when there is one.
 */
export type Tally = {
  rebinds: boolean
  typeNamed: boolean
  reads: number
  read: ReadEvent | null
}
