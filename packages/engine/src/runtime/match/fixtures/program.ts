import { parse } from '@typescript-eslint/typescript-estree'
import type { TSESTreeOptions } from '@typescript-eslint/typescript-estree'

/**
 * The AST of a source, parsed with its comments, tokens and positions.
 *
 * @param code the source
 * @returns the `Program` node typescript-estree parses from the source
 */
export const program = (code: string) =>
  parse(code, {
    comment: true,
    loc: true,
    range: true,
    tokens: true,
  } satisfies TSESTreeOptions)
