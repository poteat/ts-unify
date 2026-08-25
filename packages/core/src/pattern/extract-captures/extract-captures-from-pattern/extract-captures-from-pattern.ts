import type { TSESTree } from '@typescript-eslint/types'

import type { FLUENT_INNER } from '@/ast/fluent-node'
import type { OR_BRAND } from '@/ast/or'
import type { Sealed } from '@/ast/sealed'
import type { SEQ_BRAND } from '@/ast/seq-brand'
import type { Capture, $, Spread } from '@/capture'
import type { CoalesceUnionOfBags } from '@/pattern/coalesce-union-of-bags'
import type { IntersectValues } from '@/pattern/intersect-values'
import type { StripOr } from '@/pattern/strip-or'
import type { StripSeal } from '@/pattern/strip-seal'
import type { UnionToIntersection, Overwrite } from '@/type-utils'

import type {
  CapturesAt,
  ExtractFromPropertyValue,
  ReKeyIfSingle,
  StripWith,
} from './types'

/**
 * The capture bag of a pattern, walked for the capture-only tokens: `$`,
 * `Spread`, `__with`, `__only`, and a sealed node re-keyed under `Key`.
 *
 * A fluent node is read under its brand: its methods mention the node's own
 * captures, and walking them recurses into this computation at every level.
 * An AST node is not walked; a primitive gives `{}`.
 */
export type ExtractCapturesFromPattern<P, Key extends string = ''> = P extends {
  readonly [FLUENT_INNER]: infer N
}
  ? ExtractCapturesFromPattern<N, Key>
  : P extends Sealed<infer _Inner>
    ? ExtractCapturesFromPattern<StripSeal<P>, ''> extends infer Bag
      ? Key extends ''
        ? Bag
        : ReKeyIfSingle<Bag, Key>
      : never
    : P extends { readonly [OR_BRAND]: true }
      ? StripOr<P> extends infer U
        ? U extends unknown
          ? ExtractCapturesFromPattern<U, Key>
          : never
        : never
      : P extends { readonly [SEQ_BRAND]: infer Elements }
        ? Elements extends readonly unknown[]
          ? UnionToIntersection<
              { [K in keyof Elements]: CapturesAt<Elements, K> }[number]
            >
          : {}
        : P extends { readonly __with: infer WB }
          ? Overwrite<ExtractCapturesFromPattern<StripWith<P>, Key>, WB & {}>
          : P extends { readonly __only: infer OB }
            ? OB & {}
            : P extends TSESTree.Node
              ? {}
              : P extends $
                ? Key extends ''
                  ? {}
                  : { [K in Key]: unknown }
                : P extends Capture
                  ? P extends Capture<infer Name, infer V>
                    ? { [K in Name]: V }
                    : never
                  : P extends Spread
                    ? P extends Spread<infer Name, infer Elem>
                      ? { [K in Name]: ReadonlyArray<Elem> }
                      : never
                    : P extends readonly [...infer Items]
                      ? Items extends readonly []
                        ? {}
                        : UnionToIntersection<
                            {
                              [K in keyof Items]: Items[K] extends Spread<
                                infer Name,
                                infer Elem
                              >
                                ? Name extends ''
                                  ? Key extends ''
                                    ? CapturesAt<Items, K>
                                    : { [PKey in Key]: ReadonlyArray<Elem> }
                                  : CapturesAt<Items, K>
                                : CapturesAt<Items, K>
                            }[number]
                          >
                      : P extends object
                        ? {
                            -readonly [K in keyof P]-?: CoalesceUnionOfBags<
                              ExtractFromPropertyValue<P[K], K & string>
                            >
                          } extends infer M
                          ? IntersectValues<M>
                          : never
                        : {}
