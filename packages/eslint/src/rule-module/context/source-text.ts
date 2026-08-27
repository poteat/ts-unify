/**
 * The full text of the file under lint, or "" when the context carries
 * none.
 *
 * @param sourceCode a context's source, of either surface
 * @returns the source's `text`, else what `getText()` gives, else an empty
 *          string
 */
export function sourceText(sourceCode: unknown) {
  if (typeof sourceCode !== 'object' || !sourceCode) return ''

  if ('text' in sourceCode && typeof sourceCode.text === 'string') {
    return sourceCode.text
  }

  if ('getText' in sourceCode && typeof sourceCode.getText === 'function') {
    const text: unknown = sourceCode.getText()

    return typeof text === 'string' ? text : ''
  }

  return ''
}
