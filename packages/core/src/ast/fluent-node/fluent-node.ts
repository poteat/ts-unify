import type { NodeWithAtLeast } from '@/ast/node-with-at-least'
import type { NodeWithAtMost } from '@/ast/node-with-at-most'
import type { NodeWithBind } from '@/ast/node-with-bind'
import type { NodeWithDefault } from '@/ast/node-with-default'
import type { NodeWithDefaultUndefined } from '@/ast/node-with-default-undefined'
import type { NodeWithExactly } from '@/ast/node-with-exactly'
import type { NodeWithNone } from '@/ast/node-with-none'
import type { NodeWithSeal } from '@/ast/node-with-seal'
import type { NodeWithSome } from '@/ast/node-with-some'
import type { NodeWithTo } from '@/ast/node-with-to'
import type { NodeWithTruthy } from '@/ast/node-with-truthy'
import type { NodeWithUntil } from '@/ast/node-with-until'
import type { NodeWithWhen } from '@/ast/node-with-when'
import type { NodeWithWhere } from '@/ast/node-with-where'
import type { NodeWithWith } from '@/ast/node-with-with'

import type { FLUENT_INNER } from './brand'

/**
 * A node shape `N` with the fluent helpers on it: `.when()`, `.with()`,
 * `.bind()`, `.seal()`, `.to()`, `.where()`, the quantifiers, and more.
 */
export type FluentNode<N> = { readonly [FLUENT_INNER]: N } & NodeWithWhen<N> &
  NodeWithDefault<N> &
  NodeWithDefaultUndefined<N> &
  NodeWithTruthy<N> &
  NodeWithWith<N> &
  NodeWithSeal<N> &
  NodeWithTo<N> &
  NodeWithBind<N> &
  NodeWithUntil<N> &
  NodeWithWhere<N> &
  NodeWithNone<N> &
  NodeWithSome<N> &
  NodeWithAtLeast<N> &
  NodeWithAtMost<N> &
  NodeWithExactly<N> & {
    /**
     * Sets the text a report carries, for a rule whose rewrites sit on
     * seq elements and that has no top-level `.to()`.
     */
    readonly message: (text: string) => FluentNode<N>

    /**
     * Marks the rule as recommended.
     */
    readonly recommended: () => FluentNode<N>
  }
