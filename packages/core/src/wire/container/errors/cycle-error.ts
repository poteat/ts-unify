import type { Provider } from '@/wire/provider'

import ProviderName from './provider-name'

/**
 * The error thrown when a provider is asked for while it is being built,
 * naming the asker and the one still under construction.
 *
 * @param provider the provider still being built
 * @param asker the provider that asked for it
 */
export const cycleError = (provider: Provider, asker: Provider | undefined) =>
  new Error(
    `${ProviderName.providerName(asker)} needs ` +
      `${ProviderName.providerName(provider)}, which is still being built`,
  )
