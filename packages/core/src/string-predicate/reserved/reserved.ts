import StringPredicate from '@/string-predicate/string-predicate'

import { CONTEXTUAL_KEYWORDS } from './contextual-keywords'
import { DEFAULT_RESERVED_OPTIONS } from './default-reserved-options'
import type { ReservedOptions } from './reserved-options'
import { RESERVED_WORDS } from './reserved-words'
import { STRICT_MODE_RESERVED_WORDS } from './strict-mode-reserved-words'

/**
 * A string predicate: the string is a reserved word, so cannot be a binding
 * name. Usable in a pattern slot or called on a captured value.
 *
 * The ECMAScript reserved words always count. With `isStrict` (the default,
 * as modules are strict code) the strict-mode reserved words and `await`
 * count too. With `isTypeScript`, TypeScript's contextual keywords count.
 *
 * @param options Which sets to consult; an omitted field takes its default.
 * @example
 * U.Identifier({ name: U.string.reserved({ isTypeScript: true }) })
 */
export function reserved(
  options: Partial<ReservedOptions> = {},
): StringPredicate.StringPredicate {
  const isStrict = options.isStrict ?? DEFAULT_RESERVED_OPTIONS.isStrict
  const isTypeScript =
    options.isTypeScript ?? DEFAULT_RESERVED_OPTIONS.isTypeScript

  return StringPredicate.brandStringPredicate(
    name =>
      RESERVED_WORDS.has(name) ||
      (isStrict &&
        (STRICT_MODE_RESERVED_WORDS.has(name) || name === 'await')) ||
      (isTypeScript && CONTEXTUAL_KEYWORDS.has(name)),
  )
}
