import Atom from '@/atom/atom'
import CreateStore from '@/atom/create-store'
import type { Missing } from '@/atom/missing'
import Slot from '@/atom/slot'
import AssertType from '@/test-utils/assert-type'

import { atoms } from './atoms'

describe('atoms', () => {
  const Run = atoms({
    RepoRoot: Atom.atom<string>(),
    CacheDir: Atom.atom<string>(),
    Clock: Atom.atom<{ readonly now: number }>(),
  })
  const repoRoot = Atom.atom(Run.RepoRoot, () => 'r')
  const cacheDir = Atom.atom(Run.CacheDir, () => 'c')
  const clock = Atom.atom(Run.Clock, { cacheDir: Run.CacheDir }, deps => ({
    now: deps.cacheDir.length,
  }))

  it('names each slot by its key, as its type and its label', () => {
    const { CacheDir } = Run

    AssertType.assertType<typeof Run.CacheDir, Slot.Atom<string, 'CacheDir'>>(0)
    AssertType.assertType<typeof CacheDir, Slot.Atom<string, 'CacheDir'>>(0)
    AssertType.assertType<
      typeof Run.Clock,
      Slot.Atom<{ readonly now: number }, 'Clock'>
    >(0)
    expect(CacheDir).toBe(Run.CacheDir)
    expect(CacheDir.key.description).toBe('CacheDir')
    expect(Run.RepoRoot.key).not.toBe(Run.CacheDir.key)
  })

  it('keeps two entries over one value type apart', () => {
    // @ts-expect-error RepoRoot and CacheDir are two names over string
    AssertType.assertType<typeof Run.RepoRoot, typeof Run.CacheDir>(0)
    AssertType.assertType<
      Missing<[typeof repoRoot, typeof clock]>,
      typeof Run.CacheDir
    >(0)
    // @ts-expect-error CacheDir is read by clock and filled by nothing
    const incomplete = CreateStore.createStore(repoRoot, clock)

    // @ts-expect-error CacheDir is still missing under Clock
    expect(() => incomplete.get(Run.Clock)).toThrow(
      'CacheDir is not filled (read by Clock)',
    )
    // @ts-expect-error CacheDir is filled by nothing in the list
    expect(() => CreateStore.createStore(repoRoot).get(Run.CacheDir)).toThrow(
      'CacheDir is not filled (read by get)',
    )
    expect(
      CreateStore.createStore(repoRoot, cacheDir, clock).get(Run.Clock),
    ).toEqual({ now: 1 })
  })

  it('makes fresh slots, apart from the entries written', () => {
    const Inner = Atom.atom<string>('inner')
    const table = atoms({ Outer: Inner })

    expect(table.Outer).not.toBe(Inner)
    expect(table.Outer.key.description).toBe('Outer')
    AssertType.assertType<typeof table.Outer, Slot.Atom<string, 'Outer'>>(0)
  })
})
