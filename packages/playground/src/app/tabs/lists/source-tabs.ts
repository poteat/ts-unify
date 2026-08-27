import type { Tab } from '@ts-unify/playground/app/tabs/types'
import type { SourceTab } from '@ts-unify/playground/app/types'

/**
 * The source panel's tabs: the text and its AST.
 */
export const SOURCE_TABS: readonly Tab<SourceTab>[] = [
  { key: 'source', label: 'source' },
  { key: 'ast', label: 'AST' },
]
