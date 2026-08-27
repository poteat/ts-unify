/**
 * A shape with a `to` member typed `T`, as a seq combinator carries its
 * rewrite hook; matched to read the member's type off a pattern.
 */
export type ToMember<T> = { to: T }
