import Capture from '@/capture'

import { SPREAD_BRAND } from './spread'

describe('Spread token', () => {
  it('exports a brand symbol', () => {
    expect(typeof SPREAD_BRAND).toBe('symbol')
  })

  it('$ spread sugar yields exactly one token at runtime', () => {
    const tokens = [...Capture.$<'rest', number>('rest')]
    expect(Array.isArray(tokens)).toBe(true)
    expect(tokens).toHaveLength(1)
  })
})
