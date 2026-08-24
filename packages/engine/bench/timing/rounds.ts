/**
 * How many times each phase runs, the best taken; how many setups one
 * setup round batches; the profile's rounds; and the microsecond scale.
 */
export const ROUNDS = {
  match: 15,
  rewrite: 7,
  setup: 5,
  setupBatch: 200,
  microsPerMs: 1000,
  profile: 20,
} as const
