import type { ExtractCaptures } from '@/pattern/extract-captures'
import type { SingleKeyOf } from '@/type-utils/single-key-of'

type Keys<N> = keyof ExtractCaptures<N>

export type HasZeroCaptures<N> = [Keys<N>] extends [never] ? true : false

export type HasSingleCapture<N> = [SingleKeyOf<ExtractCaptures<N>>] extends [
  never,
]
  ? false
  : true

export type HasManyCaptures<N> =
  HasZeroCaptures<N> extends true
    ? false
    : HasSingleCapture<N> extends true
      ? false
      : true
