import type { BindNode } from '@/capture/bind-captures/bind-node/bind-node'
import type { KeyStr, ShapeAt } from '@/capture/bind-captures/shape'
import type { Capture } from '@/capture/capture-type'
import type { OBJECT_SPREAD_BRAND } from '@/capture/dollar-spread'

import type { PatternKeys } from './types'

/**
 * An object pattern bound key by key against a shape. Under `{ ...$ }` the
 * keys of the shape the pattern leaves out, `type` aside, become captures.
 *
 * @typeParam P object pattern
 * @typeParam S shape at the object's position
 */
export type BindObject<P extends object, S> = {
  readonly [K in
    | PatternKeys<P>
    | (P extends { readonly [OBJECT_SPREAD_BRAND]: true }
        ? Exclude<keyof S, keyof P | 'type'> & string
        : never)]: K extends PatternKeys<P>
    ? BindNode<
        P[Extract<K, keyof P>],
        ShapeAt<S, Extract<K, PropertyKey>>,
        KeyStr<K>
      >
    : Capture<KeyStr<K>, K extends keyof S ? S[K] : never>
}
