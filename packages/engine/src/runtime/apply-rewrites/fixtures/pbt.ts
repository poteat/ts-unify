/**
 * How the property tests run: how many random inputs each takes, and
 * the seed of each.
 */
export const PBT = {
  runs: 50,
  seeds: { identity: 42, commute: 7, fused: 99 },
} as const
