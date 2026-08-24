import type { Capture } from '@/capture/capture-type'

import type { ApplyMods, ExtractMods } from './mods'
import type { TupleCaptures } from './sequence'
import type { ArrayElem, IsTuple } from './shape'

/**
 * A `$` placeholder bound at a position: under a key it becomes a capture
 * of that name; at the root it becomes one capture per key of the shape.
 *
 * @typeParam P the placeholder, read for its modifiers
 * @typeParam S shape at the placeholder's position
 * @typeParam Key key of the position; empty at the root
 */
export type BindPlaceholder<P, S, Key extends string> = Key extends ''
  ? S extends readonly unknown[]
    ? IsTuple<S> extends true
      ? Readonly<TupleCaptures<S>>
      : ReadonlyArray<Capture<`${number}`, ArrayElem<S>>>
    : S extends object
      ? { readonly [K in keyof S]: Capture<K & string, S[K]> }
      : never
  : Capture<Key, ApplyMods<S, ExtractMods<P>>>
