import Button from './button'
import type { TabBarProps } from './types'

/**
 * A panel header's tabs: one button per tab, the selected one
 * highlighted.
 *
 * @param props the tabs, the selected key and the select handler
 * @returns the tabs
 */
export const TabBar = <K extends string>({
  tabs,
  active,
  onSelect,
}: TabBarProps<K>) => (
  <div className="tabs">
    {tabs.map(tab => (
      <Button.TabButton
        key={tab.key}
        isActive={active === tab.key}
        onSelect={() => onSelect(tab.key)}
      >
        {tab.label}
      </Button.TabButton>
    ))}
  </div>
)
