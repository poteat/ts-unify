/**
 * The `__only` brand of a node after `.bind(name)`: the one bag that
 * reaches `.to()`, in place of the node's own captures.
 */
export type OnlyBranded<Bag> = { readonly __only: Bag }
