/**
 * A parsed node as a walk reads it: a type, and the parent slot the walk
 * fills in.
 */
export type Walked = { type: string; parent?: Walked | null }
