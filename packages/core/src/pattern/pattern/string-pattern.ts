import type { Capturable } from '@/capture/capturable'
import type { StringPredicate } from '@/string-predicate/string-predicate'

/**
 * What a primitive position accepts; a string position also takes a string
 * predicate, or a RegExp standing for one.
 */
export type StringPattern<T> = T extends string
  ? Capturable<T> | StringPredicate | RegExp
  : Capturable<T>
