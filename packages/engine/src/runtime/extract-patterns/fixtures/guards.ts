/**
 * Two guards told apart by identity: one for a root `U.or`, one for a
 * branch under it.
 */
export const GUARDS = {
  root: () => true,
  branch: () => true,
} as const
