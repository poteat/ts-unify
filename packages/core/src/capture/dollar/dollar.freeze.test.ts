import { $ } from './dollar'

describe('$ function - freezing', () => {
  it('should create frozen captures', () => {
    expect(Object.isFrozen($('test'))).toBe(true)
  })

  it('should prevent property modification', () => {
    const capture = $('test')
    expect(() => {
      // @ts-ignore - Testing runtime behavior
      capture.name = 'modified'
    }).toThrow()
  })

  it('should prevent property addition', () => {
    const capture = $('test')
    expect(() => {
      // @ts-ignore - Testing runtime behavior
      capture.extra = 'property'
    }).toThrow()
  })

  it('should prevent property deletion', () => {
    const capture = $('test')
    expect(() => {
      // @ts-ignore - Testing runtime behavior
      delete capture.name
    }).toThrow()
  })
})
