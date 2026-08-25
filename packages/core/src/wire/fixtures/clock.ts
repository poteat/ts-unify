/**
 * A provider with no dependencies; a fresh object per build, so identity
 * shows how many times it ran.
 */
export const clock = () => ({ now: 1 })
