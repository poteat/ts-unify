import Dollar from '@/capture/dollar'

import Brand from './brand'

describe('spread', () => {
  it('exports a brand symbol', () => {
    expect(typeof Brand.SPREAD_BRAND).toBe('symbol')
  })

  it('$ spread sugar yields exactly one token at runtime', () => {
    const tokens = [...Dollar.$<'rest', number>('rest')]
    expect(Array.isArray(tokens)).toBe(true)
    expect(tokens).toHaveLength(1)
  })
})
