import Atom from '@/atom/atom'

import type { Clock } from './clock'
import type { Request } from './request'

/**
 * A value over a scoped slot and a parent's, so a test can check which
 * memo each came from.
 */
export type Handler = { readonly request: Request; readonly clock: Clock }

/**
 * The slot `handler` fills.
 */
export const Handler = Atom.atom<Handler>('Handler')
