/**
 * The names whose reads do not count here: an identifier's own name
 * under the identifier, a read of it there being no read of the const.
 */
export type Suppressed = { name: string; up: Suppressed | null }
