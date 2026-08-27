import { readFileSync, writeFileSync } from 'node:fs'

import { relativeTo } from './paths/relative-to.mjs'
import { ALIAS_IMPORT_SOURCE } from './patterns/alias-import-source.mjs'

/**
 * Rewrites the `@/x` imports of one declaration file to relative paths,
 * in place; a file with none is left untouched.
 *
 * @param dist the build folder the alias is rooted at
 * @param file the declaration file
 * @returns how many imports were rewritten
 */
export function rewriteFile(dist, file) {
  const before = readFileSync(file, 'utf8')
  let rewritten = 0
  const after = before.replace(
    new RegExp(ALIAS_IMPORT_SOURCE, 'g'),
    (...found) => {
      const { lead, quote, target } = found.at(-1)
      rewritten += 1

      return `${lead}${quote}${relativeTo(dist, file, target)}${quote}`
    },
  )

  if (after !== before) writeFileSync(file, after)

  return rewritten
}
