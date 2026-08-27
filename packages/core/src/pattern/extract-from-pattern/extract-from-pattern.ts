import type { TSESTree } from '@typescript-eslint/types'

import type OrTypes from '@/ast/or/types'
import type { Sealed } from '@/ast/sealed'
import type { StripOr } from '@/pattern/strip-or'
import type { StripSeal } from '@/pattern/strip-seal'
import type { UnionToIntersection } from '@/type-utils'

import type { ExtractFromObject } from './extract-from-object'
import type { TokenBag } from './types'

/**
 * The bag of every `Token` in a pattern, keyed by the token's name; `Token`
 * is the branded shape to collect, `Capture` or `ConfigSlot`.
 *
 * A seal is looked through, an or-combinator distributes over its branches,
 * and an AST node is not walked.
 */
export type ExtractFromPattern<P, Token, Key extends string = ''> =
  P extends Sealed<infer _Inner>
    ? ExtractFromPattern<StripSeal<P>, Token, Key>
    : P extends OrTypes.OrBranded
      ? StripOr<P> extends infer U
        ? U extends unknown
          ? ExtractFromPattern<U, Token, Key>
          : never
        : never
      : P extends TSESTree.Node
        ? {}
        : P extends Token
          ? TokenBag<P>
          : P extends readonly [...infer Items]
            ? UnionToIntersection<
                {
                  [K in keyof Items]: ExtractFromPattern<
                    Items[K],
                    Token,
                    `${K & string}`
                  >
                }[number]
              >
            : P extends object
              ? ExtractFromObject<P, Token>
              : {}
