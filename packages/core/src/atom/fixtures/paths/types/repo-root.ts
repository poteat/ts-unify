import Atom from '@/atom/atom'
import Slot from '@/atom/slot'

/**
 * A path, one of two slots over `string`; the name keeps them apart.
 */
export type RepoRoot = Slot.Atom<string, 'RepoRoot'>

/**
 * The slot `repoRoot` fills.
 */
export const RepoRoot = Atom.atom<RepoRoot>('RepoRoot')
