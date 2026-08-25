import Match from '..'
import { agrees } from './agrees'
import Fixtures from './fixtures'
import Reads from './reads'
import { rootLiteralsOf } from './root-literals-of'

describe('agrees', () => {
  const literals = rootLiteralsOf(Fixtures.TYPEOF_BINARY)

  it('reads a value down a path, undefined past a non-object', () => {
    expect(Reads.valueAt(Fixtures.TYPEOF_NODE, ['left', 'operator'])).toBe(
      'typeof',
    )
    expect(
      Reads.valueAt(Fixtures.TYPEOF_NODE, ['left', 'x', 'c']),
    ).toBeUndefined()
    expect(Reads.valueAt(null, ['a'])).toBeUndefined()
  })

  it('holds when every literal does and not otherwise', () => {
    expect(agrees(Fixtures.TYPEOF_NODE, literals)).toBe(true)
    expect(agrees({ ...Fixtures.TYPEOF_NODE, operator: '!=' }, literals)).toBe(
      false,
    )
    expect(agrees({ ...Fixtures.TYPEOF_NODE, left: null }, literals)).toBe(
      false,
    )
  })

  it('tells the match to reject before it what it would reject', () => {
    const mismatch = { ...Fixtures.TYPEOF_BINARY, operator: '!=' }
    expect(Match.match(Fixtures.TYPEOF_NODE, Fixtures.TYPEOF_BINARY)).toEqual(
      {},
    )
    expect(Match.matchWithSites(Fixtures.TYPEOF_NODE, mismatch)).toBeNull()
    expect(Match.matchAdmitted(Fixtures.TYPEOF_NODE, mismatch)).toBeNull()
  })
})
