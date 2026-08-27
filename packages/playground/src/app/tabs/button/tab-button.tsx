import type { TabButtonProps } from './types'

/**
 * A tab of a panel header, highlighted when it is the one selected.
 *
 * @param props the label, whether selected, and the select handler
 * @returns the button
 */
export const TabButton = ({ isActive, onSelect, children }: TabButtonProps) => (
  <button className={isActive ? 'tab active' : 'tab'} onClick={onSelect}>
    {children}
  </button>
)
