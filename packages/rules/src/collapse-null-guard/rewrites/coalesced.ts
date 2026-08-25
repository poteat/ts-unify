import { U } from '@ts-unify/core'
import type { TSESTree } from '@typescript-eslint/types'

/**
 * The expression `value ?? fallback`, under an `as` when the return it
 * replaces had one.
 *
 * @param value the guarded value
 * @param fallback what the guard returned in its place
 * @param typeAnnotation the asserted type; absent when the return was bare
 */
export function coalesced(
  value: TSESTree.Expression,
  fallback: TSESTree.Expression,
  typeAnnotation?: TSESTree.TypeNode,
) {
  const coalesce = U.LogicalExpression({
    operator: '??',
    left: value,
    right: fallback,
  })

  return typeAnnotation
    ? U.TSAsExpression({ expression: coalesce, typeAnnotation })
    : coalesce
}
