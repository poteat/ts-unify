import AssertType from '@/test-utils/assert-type'

import type { CommentNode, CommentKind, JsdocTag } from './comment-node'

describe('CommentNode', () => {
  it("is discriminated by type 'Comment'", () => {
    AssertType.assertType<CommentNode['type'], 'Comment'>(0)
  })

  it('has three kinds', () => {
    AssertType.assertType<CommentKind, 'line' | 'block' | 'jsdoc'>(0)
  })

  it('carries jsdoc parts as arrays', () => {
    AssertType.assertType<CommentNode['lines'], string[]>(0)
    AssertType.assertType<CommentNode['summary'], string[]>(0)
    AssertType.assertType<CommentNode['body'], string[]>(0)
    AssertType.assertType<CommentNode['tags'], JsdocTag[]>(0)
  })
})
