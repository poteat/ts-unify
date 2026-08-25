import Atom from '@/atom/atom'

import type { Clock } from './clock'

/**
 * A value over two others; it keeps the clock it was handed, so a test
 * can check it is the one the store holds.
 */
export type Stamp = { readonly clock: Clock; readonly text: string }

/**
 * The slot `stamp` fills.
 */
export const Stamp = Atom.atom<Stamp>('Stamp')
