import type { HasSingleCapture } from '@/ast/capture-cardinality'

/**
 * The rest parameter that gates a call to single-capture nodes: an empty
 * tuple when `Node` has exactly one capture, `[never]` otherwise.
 */
export type SingleCaptureOnly<Node> = [HasSingleCapture<Node>] extends [true]
  ? []
  : [never]
