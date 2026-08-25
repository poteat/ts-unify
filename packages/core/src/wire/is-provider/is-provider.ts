import type { Provider } from '@/wire/provider'

/**
 * Whether a value is a provider, which is to say a function.
 *
 * The error types a parameter collapses to never reach the runtime; this
 * is what the runtime holds a value to instead.
 */
export const isProvider = (value: unknown): value is Provider =>
  typeof value === 'function'
