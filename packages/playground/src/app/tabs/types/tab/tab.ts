/**
 * One tab of a panel header: the key it selects and the label it shows.
 */
export type Tab<K extends string> = {
  readonly key: K
  readonly label: string
}
