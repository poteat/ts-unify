import { parse } from '@typescript-eslint/typescript-estree'

/**
 * The source parsed with ranges and locations, which the rules and the
 * fixes read.
 *
 * @param source the source text
 * @returns the program
 */
export const parseSafe = (source: string) =>
  parse(source, { range: true, loc: true })
