import type { ReservedOptions } from './types'

/**
 * What `reserved()` consults when a call names nothing else: the strict-mode
 * words, as modules are strict code, and no TypeScript keyword.
 */
export const DEFAULT_RESERVED_OPTIONS: ReservedOptions = {
  isStrict: true,
  isTypeScript: false,
}
