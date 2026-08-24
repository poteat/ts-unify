import type { StringPredicate } from '@/string-predicate/string-predicate'

/**
 * What `identifierName()` returns: a string predicate that, called, narrows
 * its argument to `string` when true.
 */
export type IdentifierNamePredicate = ((value: unknown) => value is string) &
  StringPredicate
