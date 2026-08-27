import type { Tab } from '@ts-unify/playground/app/tabs/types'
import type { OutputTab } from '@ts-unify/playground/app/types'

/**
 * The output panel's tabs: the rewritten text, its AST and the diff.
 */
export const OUTPUT_TABS: readonly Tab<OutputTab>[] = [
  { key: 'source', label: 'source' },
  { key: 'ast', label: 'AST' },
  { key: 'diff', label: 'diff' },
]
