import type { NormalizeCaptured } from '@/ast/normalize-captured'

/**
 * The capture bag after `.bind(name)`: the one entry `Name`, holding the
 * whole node.
 */
export type BindBagEntries<Node, Name extends string> = {
  [K in Name]: NormalizeCaptured<Node>
}
