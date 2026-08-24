import { METADATA_KEYS } from '@ts-unify/engine'

import { nodeAt } from './node-at'
import Parens from './parens'
import RenamedFields from './renamed-fields'
import { toRecastShape } from './to-recast-shape'

/**
 * A copy of one typescript-estree node in the shape recast prints, its
 * children through `toRecastShape`; the node is left untouched.
 *
 * The copy carries `typeParameters` beside `typeArguments`, `typeAnnotation`
 * beside a `returnType`, parentheses round a compound type under an array or
 * operator type, and `parenthesized` on an operand recast would print bare.
 *
 * @param node the node
 */
export function recastNode(node: object): Record<string, unknown> {
  const copy: Record<string, unknown> = {}

  for (const [k, v] of Object.entries(node)) {
    if (METADATA_KEYS.has(k)) continue
    copy[k] = toRecastShape(v)
  }

  if (
    copy.typeArguments !== undefined &&
    copy.typeParameters === undefined &&
    !RenamedFields.READS_TYPE_ARGUMENTS.has(copy.type as string)
  ) {
    copy.typeParameters = copy.typeArguments
  }

  if (copy.type === 'TSArrayType' || copy.type === 'TSTypeOperator') {
    const key = copy.type === 'TSArrayType' ? 'elementType' : 'typeAnnotation'
    const inner = nodeAt(copy, key)

    if (inner && Parens.COMPOUND_TYPES.has(inner.type as string)) {
      copy[key] = { type: 'TSParenthesizedType', typeAnnotation: inner }
    }
  }

  for (const key of Parens.OPERAND_KEYS[copy.type as string] ?? []) {
    const operand = nodeAt(copy, key)

    if (operand && Parens.NEEDS_PARENS_AS_OPERAND.has(operand.type as string)) {
      operand.extra = {
        ...(operand.extra as object | undefined),
        parenthesized: true,
      }
    }
  }

  if (
    typeof copy.type === 'string' &&
    RenamedFields.RETURN_AS_TYPE_ANNOTATION.has(copy.type) &&
    copy.returnType !== undefined &&
    copy.typeAnnotation === undefined
  ) {
    copy.typeAnnotation = copy.returnType
  }

  return copy
}
