import type { TSESTree } from '@typescript-eslint/types'

import { keepsComments } from './keeps-comments'

const comment = (value: string) =>
  ({ type: 'Line', value } as unknown as TSESTree.Comment)

describe('keepsComments', () => {
  it('holds when the replaced range has no comment', () => {
    expect(keepsComments([], 'const x = 1')).toBe(true)
  })

  it('holds when the replacement still carries the comment', () => {
    expect(
      keepsComments([comment(' @ts-expect-error')], 'f(() => {\n  // @ts-expect-error\n  g()\n})'),
    ).toBe(true)
  })

  it('fails when the replacement dropped a comment', () => {
    expect(keepsComments([comment(' @ts-expect-error')], 'f(() => g())')).toBe(false)
  })
})
