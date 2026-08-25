import Atom from '@/atom/atom'

/**
 * A per-request value: what a scope fills and its parent does not.
 */
export type Request = { readonly id: string }

/**
 * The slot `request` fills.
 */
export const Request = Atom.atom<Request>('Request')
