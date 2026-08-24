import type { extractPatterns } from '@ts-unify/engine'

import type { Factory } from './factory'
import type { WithFn } from './with-fn'

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
