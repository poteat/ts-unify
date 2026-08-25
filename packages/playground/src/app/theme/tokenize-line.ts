import type { Monaco } from '@monaco-editor/react'

import Colors from './colors'
import type { Span } from './types'

/**
 * Split one line into colored spans with Monaco's tokenizer; one span in
 * the default color when there is no Monaco yet or no tokens.
 *
 * @param monaco the Monaco instance, once mounted
 * @param line the line's text
 * @param language the Monaco language id to tokenize it as
 */
export function tokenizeLine(
  monaco: Monaco | null,
  line: string,
  language: string,
): Span[] {
  if (!monaco || line.length === 0) {
    return [{ text: line, color: Colors.DEFAULT_COLOR }]
  }

  const tokens = monaco.editor.tokenize(line, language)[0] ?? []
  if (tokens.length === 0) return [{ text: line, color: Colors.DEFAULT_COLOR }]
  const spans: Span[] = []

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    const next = tokens[i + 1]
    const text = line.slice(t.offset, next ? next.offset : line.length)

    if (text)
      spans.push({
        text,
        color: Colors.tokenColor(t.type),
      })
  }

  return spans
}
