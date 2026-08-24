import { ODD_WHITESPACE } from './odd-whitespace'

/**
 * Whether any string under a tree holds odd whitespace.
 *
 * @param value a node, a list, or a leaf value
 */
export const hasOddWhitespace = (value: unknown): boolean =>
  typeof value === 'string'
    ? ODD_WHITESPACE.test(value)
    : typeof value === 'object' &&
      value !== null &&
      !(value instanceof RegExp) &&
      Object.values(value).some(hasOddWhitespace)
