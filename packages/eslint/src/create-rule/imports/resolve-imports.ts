import { CONFIG_BRAND } from '@ts-unify/core/internal'
import type { ChainEntry } from '@ts-unify/core/internal'
import { symGet } from '@ts-unify/engine'

/**
 * The imports a chain declares, as `{ specifier: modulePath }`, a config
 * slot resolved against the chain's config defaults; null when none.
 *
 * @param chain a rule's fluent chain
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
    if (typeof value === 'string') {
      resolved[specifier] = value
    } else if (
      value &&
      typeof value === 'object' &&
      symGet(value, CONFIG_BRAND) === true
    ) {
      const defaultVal = configDefaults[(value as { name: string }).name]

      if (typeof defaultVal === 'string') {
        resolved[specifier] = defaultVal
      }
    }
  }

  return Object.keys(resolved).length > 0 ? resolved : null
}
