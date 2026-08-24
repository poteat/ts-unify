import { U, $ } from '@ts-unify/core'

const returnFallback = U.ReturnStatement({ argument: $('fallback') })

const nullCheck = U.IfStatement({
  test: U.BinaryExpression({
    operator: '===',
    left: $('value'),
    right: U.Literal({ value: null }),
  }),
  consequent: U.or(
    U.BlockStatement({
      body: [returnFallback],
    }),
    returnFallback,
  ).truthy(),
  alternate: null,
})

const returnOfValue = U.ReturnStatement({
  argument: U.or(
    $('value'),
    U.TSAsExpression({
      expression: $('value'),
      typeAnnotation: $,
    }),
  ),
})

/**
 * Collapse null guard with early return into nullish coalescing.
 *
 * Precondition: `value` has type `T | null` where `T` never includes
 * `undefined`. Using `??` checks for `null | undefined`.
 *
 * @example
 * ```ts
 * if (value === null) return def;
 * return value;
 * // → return value ?? def;
 * ```
 *
 * Also preserves type assertions:
 * ```ts
 * if (value === null) return def;
 * return value as T;
 * // → return (value ?? def) as T;
 * ```
 */
export const collapseNullGuard = U.BlockStatement({
  body: [...$, nullCheck, returnOfValue],
})
  .to(({ body, value, fallback, typeAnnotation }) => {
    const coalesce = U.LogicalExpression({
      operator: '??',
      left: value,
      right: fallback,
    })

    const argument = typeAnnotation
      ? U.TSAsExpression({
          expression: coalesce,
          typeAnnotation,
        })
      : coalesce

    return U.BlockStatement({
      body: [
        ...body,
        U.ReturnStatement({
          argument,
        }),
      ],
    })
  })
  .message('Collapse null guard with early return into nullish coalescing')
  .recommended()
