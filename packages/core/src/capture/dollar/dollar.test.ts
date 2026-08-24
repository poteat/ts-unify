import Capture from '@/capture'

import { $ } from './dollar'

describe('$ function', () => {
  it('should create a capture with the given name', () => {
    expect($('test').name).toBe('test')
  })

  it('should have the capture brand', () => {
    expect($('test')[Capture.CAPTURE_BRAND]).toBe(true)
  })

  it('should preserve literal types', () => {
    const capture = $('literal')
    type Name = typeof capture.name
    const typeCheck: Name = 'literal'
    expect(typeCheck).toBe('literal')
  })

  it('should create different captures for different names', () => {
    const capture1 = $('first')
    const capture2 = $('second')
    expect(capture1.name).not.toBe(capture2.name)
  })
})
