import type {
  ParsedProgram,
  Views,
} from '@engine/runtime/comment-nodes/views/types'
import type { CommentNode } from '@ts-unify/core/internal'
import type { TSESTree } from '@typescript-eslint/types'

import DeclarationStarts from './declaration-starts'
import ToCommentNode from './to-comment-node'
/**
 * The views of a program's comments, built from its comments and tokens:
 * the first comment is the header when it ends before the first token.
 *
 * @param program the parsed program
 */
export function buildViews(program: ParsedProgram): Views {
  const raws = program.comments ?? []
  const starts = DeclarationStarts.declarationStarts(program)
  const tokenStarts = (program.tokens ?? []).map(t => t.range[0])
  const byRaw = new WeakMap<object, CommentNode>()
  const firstToken = tokenStarts[0] ?? Infinity
  const parent = program as unknown as TSESTree.Program
  const list = raws.map((raw, index) => {
    const node = ToCommentNode.toCommentNode(raw, {
      parent,
      starts,
      tokenStarts,
      isHeader: index === 0 && raw.range[1] <= firstToken,
    })
    byRaw.set(raw, node)

    return node
  })

  return { list, byRaw }
}
