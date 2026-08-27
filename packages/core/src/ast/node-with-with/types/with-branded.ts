/**
 * The `__with` brand of a node: the bag `.with()` merged, carried apart
 * from the shape so a downstream walker can find it and take it off.
 */
export type WithBranded<Bag> = { readonly __with: Bag }
