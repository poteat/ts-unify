import type { ChainEntry } from '@ts-unify/core/internal'
import { extractPatterns, proxyNodeOf } from '@ts-unify/engine'
import type { Factory, RuleMeta, WithFn } from '@ts-unify/runner/types'

import Util from './util'

/**
 * Extract runtime metadata from a rule transform's proxy chain.
 * Shared by the ESLint plugin, the playground, and any future CLI.
 *
 * @param exportName the rule's camelCase export name
 * @param transform the rule's transform value
 */
export function extractRuleMeta(
  exportName: string,
  transform: unknown,
): RuleMeta {
  const kebab = Util.kebabCase(exportName)
  const patterns = extractPatterns(transform)
  const node = proxyNodeOf(transform)

  const msgEntry = node?.chain.find((c: ChainEntry) => c.method === 'message')
  const message = (msgEntry?.args[0] as string | undefined) ?? kebab

  const toEntry = node?.chain.find((c: ChainEntry) => c.method === 'to')
  const factory: Factory | null = toEntry
    ? ((toEntry.args[0] as Factory | undefined) ?? Util.singleCaptureFactory)
    : null

  const withs: WithFn[] = []

  if (factory && node) {
    for (const entry of node.chain) {
      if (entry.method === 'to') break
      if (entry.method === 'with') withs.push(entry.args[0] as WithFn)
    }
  }

  const isRecommended =
    node?.chain.some((c: ChainEntry) => c.method === 'recommended') ?? false

  return { kebab, message, patterns, factory, withs, isRecommended }
}
