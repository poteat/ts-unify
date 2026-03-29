import type { ExtractCaptures } from "@/pattern";
import type { KeysToTuple } from "@/type-utils/keys-to-tuple";

type KeysTuple<N> = KeysToTuple<ExtractCaptures<N>>;

export type HasZeroCaptures<N> = KeysTuple<N> extends readonly []
  ? true
  : false;
export type HasSingleCapture<N> = KeysTuple<N> extends readonly [any]
  ? true
  : false;
export type HasManyCaptures<N> = HasZeroCaptures<N> extends true
  ? false
  : HasSingleCapture<N> extends true
  ? false
  : true;
