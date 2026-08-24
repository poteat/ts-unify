import type { CommentKind, CommentNode } from '@ts-unify/core/internal'
import type { TSESTree } from '@typescript-eslint/types'

import { attachedDeclaration } from './attached-declaration'
import type { CommentSetting } from './comment-setting'
import { jsdocParts } from './jsdoc-parts'
import Lines from './lines'

/**
 * The `Comment` node of one raw parser comment.
 *
 * @param raw the parser's comment
 * @param setting what the comment is read against
 */
export function toCommentNode(
  raw: TSESTree.Comment,
  setting: CommentSetting,
): CommentNode {
  const kind: CommentKind =
    raw.type === 'Line' ? 'line' : raw.value.startsWith('*') ? 'jsdoc' : 'block'
  const lines = kind === 'jsdoc' ? Lines.jsdocLines(raw.value) : null
  const parts = jsdocParts(lines ?? [])

  return {
    type: 'Comment',
    kind,
    text: lines ? lines.join('\n') : raw.value,
    lines: (raw.type === 'Line' ? `//${raw.value}` : `/*${raw.value}*/`).split(
      '\n',
    ),
    ...parts,
    attachedTo: attachedDeclaration(raw, setting.starts, setting.tokenStarts),
    isHeader: setting.isHeader,
    loc: raw.loc,
    range: raw.range,
    parent: setting.parent,
  }
}
