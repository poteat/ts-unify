import { COMPOUND_TYPES } from './compound-types'
import { NEEDS_PARENS_AS_OPERAND } from './needs-parens-as-operand'
import { NON_CHILD_KEYS } from './non-child-keys'
import { OPERAND_KEYS } from './operand-keys'
import { READS_TYPE_ARGUMENTS } from './reads-type-arguments'
import { RETURN_AS_TYPE_ANNOTATION } from './return-as-type-annotation'

/**
 * A copy of a typescript-estree tree in the shape recast prints; the
 * input is left untouched.
 *
 * recast's TS printer predates typescript-estree v8: the copy carries
 * `typeParameters` beside `typeArguments` and `typeAnnotation` beside a
 * signature's `returnType`, and marks parenthesized what recast prints bare.
 *
 * @param value a node, a list of nodes, or a leaf value (a Literal's
 *   RegExp passes through whole)
 */
export function toRecastShape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(toRecastShape)
  if (value === null || typeof value !== 'object' || value instanceof RegExp)
    return value
  const node = value as Record<string, unknown>
  const copy: Record<string, unknown> = {}

  for (const [k, v] of Object.entries(node)) {
    if (NON_CHILD_KEYS.has(k)) continue
    copy[k] = toRecastShape(v)
  }

  if (
    copy.typeArguments !== undefined &&
    copy.typeParameters === undefined &&
    !READS_TYPE_ARGUMENTS.has(copy.type as string)
  ) {
    copy.typeParameters = copy.typeArguments
  }

  if (copy.type === 'TSArrayType' || copy.type === 'TSTypeOperator') {
    const key = copy.type === 'TSArrayType' ? 'elementType' : 'typeAnnotation'
    const inner = copy[key] as Record<string, unknown> | undefined

    if (inner && COMPOUND_TYPES.has(inner.type as string)) {
      copy[key] = { type: 'TSParenthesizedType', typeAnnotation: inner }
    }
  }

  for (const key of OPERAND_KEYS[copy.type as string] ?? []) {
    const operand = copy[key] as Record<string, unknown> | undefined

    if (operand && NEEDS_PARENS_AS_OPERAND.has(operand.type as string)) {
      operand.extra = {
        ...(operand.extra as object | undefined),
        parenthesized: true,
      }
    }
  }

  if (
    typeof copy.type === 'string' &&
    RETURN_AS_TYPE_ANNOTATION.has(copy.type) &&
    copy.returnType !== undefined &&
    copy.typeAnnotation === undefined
  ) {
    copy.typeAnnotation = copy.returnType
  }

  return copy
}
