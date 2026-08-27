import type { Tab } from '@ts-unify/playground/app/tabs/types'
import type { LeftTab } from '@ts-unify/playground/app/types'

/**
 * The sidebar's tabs: the rule editor and the catalog.
 */
export const LEFT_TABS: readonly Tab<LeftTab>[] = [
  { key: 'rules', label: 'rules' },
  { key: 'catalog', label: 'catalog' },
]
