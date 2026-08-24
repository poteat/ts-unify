import type { TSESTree } from '@typescript-eslint/types'

import type { Capture, $ } from '@/capture'
import type { ConfigSlot } from '@/config/config-type'
import type { StringPredicate } from '@/string-predicate/string-predicate'

import type { ExtractCapturesFromPattern } from './extract-captures-from-pattern'

/**
 * The capture bag of one property value, where a bare `$` takes the
 * property's `Key` as its name.
 *
 * An AST node, a string predicate, a RegExp and a config slot give `{}`.
 */
export type ExtractFromPropertyValue<
  T,
  Key extends string,
> = T extends TSESTree.Node
  ? {}
  : T extends StringPredicate | RegExp
    ? {}
    : T extends ConfigSlot
      ? {}
      : T extends Capture
        ? T extends Capture<infer Name, infer V>
          ? { [K in Name]: V }
          : {}
        : T extends $
          ? { [K in Key]: unknown }
          : T extends object
            ? ExtractCapturesFromPattern<T, Key>
            : {}
