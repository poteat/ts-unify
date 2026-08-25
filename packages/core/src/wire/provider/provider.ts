import type { Get } from '@/wire/get'

/**
 * A function that builds one value from the providers it asks its getter
 * for; the function is its own token, by reference and by type.
 */
export type Provider = (need: Get<readonly Provider[]>) => unknown
