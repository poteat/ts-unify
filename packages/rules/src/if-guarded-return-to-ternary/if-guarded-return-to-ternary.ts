import { U, $ } from "@ts-unify/core";

const anyReturnForm = U.maybeBlock(U.ReturnStatement({ argument: $ }))
  .defaultUndefined()
  .seal();

/**
 * Collapse if-guarded return patterns into ternary expressions
 *
 * @example
 * ```ts
 * // Before
 * if (condition) {
 *   return valueA;
 * }
 * return valueB;
 *
 * // After
 * return condition ? valueA : valueB;
 * ```
 *
 * @example
 * ```ts
 * // Before
 * if (condition) return valueA;
 * return valueB;
 *
 * // After
 * return condition ? valueA : valueB;
 * ```
 */
export const ifGuardedReturnToTernary = U.BlockStatement({
  body: [
    ...$,
    U.IfStatement({
      test: $,
      consequent: anyReturnForm,
      alternate: null,
    }),
    U.ReturnStatement({ argument: $("alternate") }).defaultUndefined(),
  ],
})
  .to(({ body, ...bag }) =>
    U.BlockStatement({
      body: [
        ...body,
        U.ReturnStatement({
          argument: U.ConditionalExpression(bag),
        }),
      ],
    }),
  )
  .message("Collapse if-guarded return into ternary")
  .recommended();
