import type { TSESTree } from '@typescript-eslint/types'

import type { ExtractFromObject } from '@/pattern/extract-from-pattern/extract-from-object/extract-from-object'
import type { TokenBag } from '@/pattern/extract-from-pattern/types'

/**
 * The `Token` bag of one property value: the token's own name and value,
 * the bag of a nested object, or `{}` for an AST node or a primitive.
 */
export type ExtractFromValue<T, Token> = T extends TSESTree.Node
  ? {}
  : T extends Token
    ? TokenBag<T>
    : T extends object
      ? ExtractFromObject<T, Token>
      : {}
