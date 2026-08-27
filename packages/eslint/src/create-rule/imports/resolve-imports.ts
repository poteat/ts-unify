import { CONFIG_BRAND } from '@ts-unify/core/internal'
import type { ChainEntry, ConfigSlot } from '@ts-unify/core/internal'
import { symGet } from '@ts-unify/engine'

/**
 * The imports a chain declares, as `{ specifier: modulePath }`, a config
 * slot resolved against the chain's config defaults; null when none.
 *
 * @param chain a rule's fluent chain
 * @returns each specifier to its module path, or null when the chain declares
 *          no usable import
 */
export function resolveImports(
  chain: readonly ChainEntry[],
): Record<string, string> | null {
  const importsEntry = chain.find(c => c.method === 'imports')
  if (!importsEntry) return null

  const configEntry = chain.find(c => c.method === 'config')
  const configDefaults: Record<string, unknown> =
    (configEntry?.args[0] as Record<string, unknown> | undefined) ?? {}

  const raw = importsEntry.args[0] as Record<string, unknown>
  const resolved: Record<string, string> = {}

  for (const [specifier, value] of Object.entries(raw)) {
    const isConfigSlot =
      typeof value === 'object' &&
      value !== null &&
      symGet(value, CONFIG_BRAND) === true

    if (typeof value === 'string') {
      resolved[specifier] = value
    } else if (isConfigSlot) {
      const defaultVal = configDefaults[(value as ConfigSlot).name]

      if (typeof defaultVal === 'string') {
        resolved[specifier] = defaultVal
      }
    }
  }

  return Object.keys(resolved).length > 0 ? resolved : null
}
