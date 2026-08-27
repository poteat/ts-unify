import { METADATA_KEYS } from '@ts-unify/engine'
import RecastShape from '@ts-unify/eslint/print-node/recast-shape'

import Parens from './parens'
import RenamedFields from './renamed-fields'
import Util from './util'

/**
 * A copy of one typescript-estree node in the shape recast prints, its
 * children through `toRecastShape`; the node is left untouched.
 *
 * The copy carries `typeParameters` beside `typeArguments`, `typeAnnotation`
 * beside a `returnType`, parentheses round a compound type under an array or
 * operator type, and `parenthesized` on an operand recast would print bare.
 *
 * @param node the node
 * @returns the copied node with the fields recast's printer reads
 */
export function recastNode(node: object): Record<string, unknown> {
  const copy: Record<string, unknown> = {}

  for (const [k, v] of Object.entries(node)) {
    if (METADATA_KEYS.has(k)) continue
    copy[k] = RecastShape.toRecastShape(v)
  }

  const shouldMoveTypeArguments =
    copy.typeArguments !== undefined &&
    copy.typeParameters === undefined &&
    !RenamedFields.READS_TYPE_ARGUMENTS.has(copy.type as string)

  if (shouldMoveTypeArguments) {
    copy.typeParameters = copy.typeArguments
  }

  if (copy.type === 'TSArrayType' || copy.type === 'TSTypeOperator') {
    const key = copy.type === 'TSArrayType' ? 'elementType' : 'typeAnnotation'
    const inner = Util.nodeAt(copy, key)

    if (inner && Parens.COMPOUND_TYPES.has(inner.type as string)) {
      copy[key] = { type: 'TSParenthesizedType', typeAnnotation: inner }
    }
  }

  for (const key of Parens.OPERAND_KEYS[copy.type as string] ?? []) {
    const operand = Util.nodeAt(copy, key)

    if (operand && Parens.NEEDS_PARENS_AS_OPERAND.has(operand.type as string)) {
      operand.extra = {
        ...(operand.extra as object | undefined),
        parenthesized: true,
      }
    }
  }

  const shouldMoveReturnType =
    typeof copy.type === 'string' &&
    RenamedFields.RETURN_AS_TYPE_ANNOTATION.has(copy.type) &&
    copy.returnType !== undefined &&
    copy.typeAnnotation === undefined

  if (shouldMoveReturnType) {
    copy.typeAnnotation = copy.returnType
  }

  return copy
}
