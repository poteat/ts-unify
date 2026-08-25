import Atom from '@/atom/atom'
import Slot from '@/atom/slot'

/**
 * A per-request value: what a scope fills and its parent does not.
 */
export type Request = Slot.Atom<{ readonly id: string }>

/**
 * The slot `request` fills.
 */
export const Request = Atom.atom<Request>('Request')
