import type { Provider } from '@/wire/provider'

/**
 * A provider's function name for an error message; `get` when the value
 * was asked for from outside, and a stand-in for an anonymous function.
 *
 * @param provider the provider, or nothing for the outside caller
 */
export const providerName = (provider: Provider | undefined) =>
  provider === undefined
    ? 'get'
    : provider.name === ''
      ? 'an anonymous provider'
      : provider.name
