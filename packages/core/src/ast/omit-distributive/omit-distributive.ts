/**
 * `Omit<T, K>` applied to each member of a union `T` in turn, so a union
 * of shapes keeps its members.
 */
export type OmitDistributive<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never
