/**
 * A clock the root `.when()` guards of a rule are wrapped with, summing
 * the milliseconds spent inside them.
 */
export type GuardClock = { ms: number }
