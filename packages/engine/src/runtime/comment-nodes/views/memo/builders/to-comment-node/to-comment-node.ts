import type { CommentKind, CommentNode } from '@ts-unify/core/internal'
import type { TSESTree } from '@typescript-eslint/types'

import Attached from './attached'
import Jsdoc from './jsdoc'
import type { CommentSetting } from './types'
/**
 * The `Comment` node of one raw parser comment.
 *
 * @param raw the parser's comment
 * @param setting what the comment is read against
 * @returns a `Comment` node with its kind, text, lines, JSDoc parts, attached
 *          declaration and position
 */
export function toCommentNode(
  raw: TSESTree.Comment,
  setting: CommentSetting,
): CommentNode {
  const kind: CommentKind =
    raw.type === 'Line' ? 'line' : raw.value.startsWith('*') ? 'jsdoc' : 'block'
  const lines = kind === 'jsdoc' ? Jsdoc.jsdocLines(raw.value) : null
  const parts = Jsdoc.jsdocParts(lines ?? [])

  return {
    type: 'Comment',
    kind,
    text: lines ? lines.join('\n') : raw.value,
    lines: (raw.type === 'Line' ? `//${raw.value}` : `/*${raw.value}*/`).split(
      '\n',
    ),
    ...parts,
    attachedTo: Attached.attachedDeclaration(
      raw,
      setting.starts,
      setting.tokenStarts,
    ),
    isHeader: setting.isHeader,
    loc: raw.loc,
    range: raw.range,
    parent: setting.parent,
  }
}
