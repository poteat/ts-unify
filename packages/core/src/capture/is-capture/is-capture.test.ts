import Capture from '@/capture'

import { isCapture } from './is-capture'

describe('isCapture', () => {
  it('should return true for capture sentinels', () => {
    expect(isCapture(Capture.$('test'))).toBe(true)
  })

  it('should return false for regular objects', () => {
    expect(
      isCapture({
        name: 'test',
      }),
    ).toBe(false)
  })

  it('should return false for null', () => {
    expect(isCapture(null)).toBe(false)
  })

  it('should return false for undefined', () => {
    expect(isCapture(undefined)).toBe(false)
  })

  it('should return false for primitives', () => {
    expect(isCapture('string')).toBe(false)
    expect(isCapture(123)).toBe(false)
    expect(isCapture(true)).toBe(false)
  })

  it('should narrow types correctly', () => {
    const value: unknown = Capture.$('test')

    isCapture(value)
      ? expect(value.name).toBe('test')
      : fail('Should have ' + 'been ' + 'identified ' + 'as capture')
  })
})
