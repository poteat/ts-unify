import StringPredicate from '@/string-predicate/string-predicate'

import {
  CONTEXTUAL_KEYWORDS,
  RESERVED_WORDS,
  STRICT_MODE_RESERVED_WORDS,
} from './reserved-words'

/**
 * Which keyword sets {@link reserved} consults; see reserved.spec.md.
 */
export type ReservedOptions = {
  /**
   * Count the strict-mode reserved words (`let`, `yield`, `static`...) and
   * `await`. Default `true`.
   */
  strict?: boolean

  /**
   * Count TypeScript's contextual keywords (`type`, `interface`, `of`...).
   * Default `false`.
   */
  typescript?: boolean
}

const always = new Set(RESERVED_WORDS)
const strictMode = new Set([...STRICT_MODE_RESERVED_WORDS, 'await'])
const contextual = new Set(CONTEXTUAL_KEYWORDS)

/**
 * A string predicate: the string is a reserved word, so cannot be a binding
 * name. Usable in a pattern slot or called on a captured value.
 *
 * The ECMAScript reserved words always count. With `strict` (the default,
 * as modules are strict code) the strict-mode reserved words and `await`
 * count too. With `typescript`, TypeScript's contextual keywords count.
 *
 * @param options Which sets to consult.
 * @example
 * U.Identifier({ name: U.string.reserved() })
 * U.string.reserved()("class")                       // true
 * U.string.reserved({ strict: false })("let")        // false
 * U.string.reserved({ typescript: true })("type")    // true
 */
export function reserved(
  options: ReservedOptions = {},
): StringPredicate.StringPredicate {
  const strict = options.strict !== false
  const typescript = options.typescript === true

  return StringPredicate.stringPredicate(
    name =>
      always.has(name) ||
      (strict && strictMode.has(name)) ||
      (typescript && contextual.has(name)),
  )
}
