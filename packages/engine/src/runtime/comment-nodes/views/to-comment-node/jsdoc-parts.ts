import type { JsdocTag } from '@ts-unify/core/internal'

import { isParagraphLine } from './is-paragraph-line'
import { isTagLine } from './is-tag-line'

/**
 * A JSDoc's lines split into its summary, its body and its tags; each
 * tag's continuation lines join its text.
 *
 * A blank line between the body and the first tag belongs to neither.
 *
 * @param lines the JSDoc's lines, as `jsdocLines` gives them
 */
export function jsdocParts(lines: readonly string[]): {
  summary: string[]
  body: string[]
  tags: JsdocTag[]
} {
  let i = 0
  const summary: string[] = []

  while (isParagraphLine(lines, i)) summary.push(lines[i++])

  const body: string[] = []

  if (i < lines.length && lines[i] === '') {
    i++

    while (i < lines.length && !isTagLine(lines[i])) body.push(lines[i++])

    if (body[body.length - 1] === '' && i < lines.length) body.pop()
  }

  const tags: JsdocTag[] = []

  while (i < lines.length) {
    const line = lines[i++]
    if (!isTagLine(line)) continue
    const space = line.search(/\s/)
    const name = space === -1 ? line : line.slice(0, space)
    const text = [space === -1 ? '' : line.slice(space + 1).trimStart()]

    while (isParagraphLine(lines, i)) text.push(lines[i++].trimStart())

    tags.push({ name, text: text.join('\n') })
  }

  return { summary, body, tags }
}
