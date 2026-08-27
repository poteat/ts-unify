import type { Tab } from './tab'

/**
 * What a tab bar shows: its tabs, which is selected, and what selecting
 * one does.
 */
export type TabBarProps<K extends string> = {
  readonly tabs: readonly Tab<K>[]
  readonly active: K

  /**
   * Makes the tab under a key the selected one.
   */
  readonly onSelect: (key: K) => void
}
