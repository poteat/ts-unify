/**
 * What a rule set's entries of one tag amount to at a node: the entries
 * whose root literals the node holds, in the set's order.
 *
 * The caller matches them in turn, the first to match winning as it
 * would have had every entry been tried.
 */
export type Dispatcher<E> = (node: unknown) => readonly E[]
