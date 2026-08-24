import type { BindNode } from '@/capture/bind-captures/bind-node'

/**
 * The elements of a seq combinator, each bound against the array's element
 * shape and keyed by its index.
 *
 * @typeParam Elements constituent patterns of the seq
 * @typeParam ElemShape element type of the array the seq matches in
 */
export type BindSeqElements<Elements extends readonly unknown[], ElemShape> = {
  [I in keyof Elements]: BindNode<Elements[I], ElemShape, `${I & string}`>
}
