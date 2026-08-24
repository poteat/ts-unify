import Dollar from '@/capture/dollar'

import { SPREAD_BRAND } from './spread-brand'

describe('spread', () => {
  it('exports a brand symbol', () => {
    expect(typeof SPREAD_BRAND).toBe('symbol')
  })

  it('$ spread sugar yields exactly one token at runtime', () => {
    const tokens = [...Dollar.$<'rest', number>('rest')]
    expect(Array.isArray(tokens)).toBe(true)
    expect(tokens).toHaveLength(1)
  })
})
