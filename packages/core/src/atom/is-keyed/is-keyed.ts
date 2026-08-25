import type { Keyed } from '@/atom/keyed'

/**
 * Whether a value is a slot: an object carrying a symbol under `key`.
 *
 * The error types a parameter collapses to never exist at runtime; this
 * is what the runtime holds an argument to instead.
 */
export const isKeyed = (value: unknown): value is Keyed =>
  typeof value === 'object' &&
  value !== null &&
  'key' in value &&
  typeof value.key === 'symbol'
