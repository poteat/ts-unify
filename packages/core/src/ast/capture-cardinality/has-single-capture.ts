import type { ExtractCaptures } from '@/pattern/extract-captures'
import type { SingleKeyOf } from '@/type-utils/single-key-of'

/**
 * `true` when a node shape declares exactly one capture.
 */
export type HasSingleCapture<N> = [SingleKeyOf<ExtractCaptures<N>>] extends [
  never,
]
  ? false
  : true
