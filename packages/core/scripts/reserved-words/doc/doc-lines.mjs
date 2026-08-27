import { DOC_WIDTH } from './util/doc-width.mjs'

/**
 * Prose as JSDoc lines, broken greedily at spaces within the width.
 *
 * @param text the prose
 * @returns the lines, each with its ` * ` gutter, joined
 */
export const docLines = text =>
  text
    .split(' ')
    .reduce((lines, word) => {
      const doesFitLastLine =
        lines.length > 0 &&
        `${lines[lines.length - 1]} ${word}`.length <= DOC_WIDTH

      return doesFitLastLine
        ? [...lines.slice(0, -1), `${lines[lines.length - 1]} ${word}`]
        : [...lines, word]
    }, [])
    .map(line => ` * ${line}`)
    .join('\n')
