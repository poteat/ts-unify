import type { Provider } from '@/wire/provider'

import ProviderName from './provider-name'

/**
 * The error thrown when a provider is asked for that neither this scope
 * nor a parent holds.
 *
 * @param provider the provider asked for
 * @param asker the provider that asked for it
 */
export const unregisteredError = (
  provider: Provider,
  asker: Provider | undefined,
) =>
  new Error(
    `${ProviderName.providerName(provider)} is not registered ` +
      `(asked for by ${ProviderName.providerName(asker)})`,
  )
