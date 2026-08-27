/**
 * A shape carrying a `type` tag `V`: the discriminant every parser node
 * has, by which its interface is picked out of `TSESTree.Node`.
 */
export type Typed<V> = { type: V }
