import type { Pattern } from './pattern'

/**
 * An object pattern over any subset of `T`'s keys; a consumer treats an
 * omitted key as "don't care".
 */
export type PatternChildren<T> = {
  [K in keyof T]?: Pattern<T[K]>
}
