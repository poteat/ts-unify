import { parse } from '@typescript-eslint/typescript-estree'
import fs from 'node:fs'

import type { ParsedFile } from './types'
/**
 * The files parsed as the ESLint adapter sees them: with comments,
 * tokens, positions and ranges. A file that does not parse is left out.
 *
 * @param files the paths parsed
 */
export function parseCorpus(files: readonly string[]): ParsedFile[] {
  const parsed: ParsedFile[] = []

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8')

    try {
      parsed.push({
        file,
        text,
        program: parse(text, {
          comment: true,
          tokens: true,
          loc: true,
          range: true,
        }),
      })
    } catch {
      continue
    }
  }

  return parsed
}
