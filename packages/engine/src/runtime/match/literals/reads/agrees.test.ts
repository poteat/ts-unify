import Match from '../..'
import Fixtures from '../fixtures'
import { rootLiteralsOf } from '../root-literals-of'
import { agrees } from './agrees'
import { valueAt } from './value-at'

describe('agrees', () => {
  const literals = rootLiteralsOf(Fixtures.TYPEOF_BINARY)

  it('reads a value down a path, undefined past a non-object', () => {
    expect(valueAt(Fixtures.TYPEOF_NODE, ['left', 'operator'])).toBe('typeof')
    expect(valueAt(Fixtures.TYPEOF_NODE, ['left', 'x', 'c'])).toBeUndefined()
    expect(valueAt(null, ['a'])).toBeUndefined()
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
