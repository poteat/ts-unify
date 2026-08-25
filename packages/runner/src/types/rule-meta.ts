import type { extractPatterns } from '@ts-unify/engine'

import type { Factory, WithFn } from './callbacks'

/**
 * What a runner needs of one rule: its name, message, the patterns to
 * match and the callbacks that rewrite a match.
 */
export type RuleMeta = {
  kebab: string
  message: string
  patterns: ReturnType<typeof extractPatterns>
  factory: Factory | null
  withs: WithFn[]
  isRecommended: boolean
}
