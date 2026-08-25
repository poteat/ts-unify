import StringPredicates from '@/string-predicate/string-predicates'

/**
 * The names the root serves as plain values: a read of `U.string` gets
 * the string predicates and records no pattern.
 */
export const VALUES: Readonly<Record<string, unknown>> = {
  string: StringPredicates.stringPredicates,
}
