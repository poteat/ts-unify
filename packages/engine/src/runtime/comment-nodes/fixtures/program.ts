import { parse } from '@typescript-eslint/typescript-estree'

/**
 * The AST of a source, parsed with comments, tokens and positions, as
 * `commentNodes` reads one.
 *
 * @param code the source parsed
 */
export const program = (code: string) =>
  parse(code, {
    comment: true,
    tokens: true,
    loc: true,
    range: true,
    jsx: false,
  })
