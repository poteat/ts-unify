import StringPredicate from '@/string-predicate/string-predicate'

import Options from './options'
import type { ReservedOptions } from './options'
import Words from './words'

/**
 * A string predicate: the string is a reserved word, so cannot be a binding
 * name. Usable in a pattern slot or called on a captured value.
 *
 * The ECMAScript reserved words always count. With `isStrict` (the default,
 * as modules are strict code) the strict-mode reserved words and `await`
 * count too. With `isTypeScript`, TypeScript's contextual keywords count.
 *
 * @param options Which sets to consult; an omitted field takes its default.
 * @returns a branded predicate, true for a word reserved under the chosen sets
 * @example
 * U.Identifier({ name: U.string.reserved({ isTypeScript: true }) })
 */
export function reserved(
  options: Partial<ReservedOptions> = {},
): StringPredicate.StringPredicate {
  const isStrict = options.isStrict ?? Options.DEFAULT_RESERVED_OPTIONS.isStrict
  const isTypeScript =
    options.isTypeScript ?? Options.DEFAULT_RESERVED_OPTIONS.isTypeScript

  return StringPredicate.brandStringPredicate(
    name =>
      Words.RESERVED_WORDS.has(name) ||
      (isStrict &&
        (Words.STRICT_MODE_RESERVED_WORDS.has(name) || name === 'await')) ||
      (isTypeScript && Words.CONTEXTUAL_KEYWORDS.has(name)),
  )
}
