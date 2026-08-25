/**
 * The deps of a definition that reads nothing, the two-argument form of
 * `atom`; a member type of `never` reads as no slot at all.
 */
export type NoDeps = { readonly [name: string]: never }
