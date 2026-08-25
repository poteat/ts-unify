import type { Provider } from '@/wire/provider'

/**
 * A parent scope's door: builds or reads a provider's value for a child
 * that does not hold the provider itself.
 */
export type Resolve = (provider: Provider, asker?: Provider) => unknown
