import type { TSESTree } from '@typescript-eslint/types'

import { keepsComments } from './keeps-comments'

describe('keeps-comments', () => {
  const directive = (value = ' @ts-expect-error') =>
    ({ type: 'Line', value }) as unknown as TSESTree.Comment

  it('holds when the replaced range has no comment', () => {
    expect(keepsComments([], 'const x = 1')).toBe(true)
  })

  it('holds when the replacement still carries the comment', () => {
    expect(
      keepsComments(
        [directive()],
        'f(() => {\n  // @ts-expect-error\n  g()\n})',
      ),
    ).toBe(true)
  })

  it('fails when the replacement dropped a comment', () => {
    expect(keepsComments([directive()], 'f(() => g())')).toBe(false)
  })
})
