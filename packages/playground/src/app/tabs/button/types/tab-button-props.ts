import type { ReactNode } from 'react'

/**
 * What a panel tab shows: its label, whether it is the one selected, and
 * what selecting it does.
 */
export type TabButtonProps = {
  readonly isActive: boolean

  /**
   * Makes this tab the selected one.
   */
  readonly onSelect: () => void

  readonly children: ReactNode
}
