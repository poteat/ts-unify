import type { KeyStr } from '@/capture/bind-captures/shape'
import type { $ } from '@/capture/dollar'
import type { StringPredicate } from '@/string-predicate/string-predicate'

/**
 * The keys of a pattern object the binder reads.
 *
 * Every key but `parent`, and but a function-valued one unless that
 * function is the `$` sentinel or a string predicate.
 *
 * @typeParam P pattern object
 */
export type PatternKeys<P extends object> = {
  [K in keyof P]-?: K extends 'parent'
    ? never
    : P[K] extends (...args: never[]) => unknown
      ? P[K] extends $ | StringPredicate
        ? KeyStr<K>
        : never
      : KeyStr<K>
}[keyof P]
