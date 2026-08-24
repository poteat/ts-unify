/**
 * A value bound to a named capture, kept so the root can check that a
 * name bound twice was bound to equal values.
 */
export type NamedBinding = { name: string; value: unknown }
