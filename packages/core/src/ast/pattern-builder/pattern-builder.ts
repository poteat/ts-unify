import type { FluentNode } from '@/ast/fluent-node'
import type { NodeByKind } from '@/ast/node-by-kind'
import type { NodeKind } from '@/ast/node-kind'
import type { OmitDistributive } from '@/ast/omit-distributive'
import type { Pattern } from '@/pattern'
import type { WithoutInternalAstFields } from '@/type-utils'

import type { PATTERN_BUILDER_BRAND } from './brand'
import type { BindAgainstNodeKind } from './types'

/**
 * `U.<K>`, the builder for the AST kind `K`.
 *
 * Called with nothing, it matches any `K`; with a pattern (captures in
 * it), it matches that pattern; with a plain shape, it builds a `K` node
 * for an output. Each form returns a fluent node.
 */
export type PatternBuilder<K extends NodeKind> = {
  <S extends OmitDistributive<WithoutInternalAstFields<NodeByKind[K]>, 'type'>>(
    shape: S,
  ): FluentNode<NodeByKind[K]>

  <P extends Pattern<NodeByKind[K]>>(
    pattern: P,
  ): FluentNode<
    { readonly type: NodeByKind[K]['type'] } & BindAgainstNodeKind<P, K>
  >

  (): FluentNode<{ readonly type: NodeByKind[K]['type'] }>
} & { readonly [PATTERN_BUILDER_BRAND]: true }
