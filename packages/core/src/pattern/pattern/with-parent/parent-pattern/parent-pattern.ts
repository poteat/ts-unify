import type { FLUENT_INNER } from '@/ast/fluent-node'
import type { Capturable } from '@/capture/capturable'
import type { CaptureLike } from '@/capture/capture-like'

import type { ParentShape } from './types'

/**
 * A pattern over a node's parent, one level deep: a capture, a fluent node,
 * or a shape whose `type` is checked and whose other keys are taken as given.
 *
 * Every AST node carries a `parent`, so a parent pattern as deep as the
 * node would let assignability walk the whole node graph through it.
 */
export type ParentPattern =
  | CaptureLike<ParentShape>
  | { readonly [FLUENT_INNER]: unknown }
  | ({ readonly type?: Capturable<ParentShape['type']> } & {
      readonly [key: string]: unknown
    })
