import Atom from '@/atom/atom'

/**
 * A second value with no deps.
 */
export type Settings = { readonly name: string }

/**
 * The slot `settings` fills.
 */
export const Settings = Atom.atom<Settings>('Settings')
