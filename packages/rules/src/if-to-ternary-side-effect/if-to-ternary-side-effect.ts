import { U, $ } from "@ts-unify/core";

const anyExprForm = U.maybeBlock(U.ExpressionStatement({ expression: $ })).seal();

/**
 * If both branches are side-effect expressions, convert to a single expression
 * statement with a ternary expression.
 *
 * @example
 * ```ts
 * // Before
 * if (cond) {
 *   expr1;
 * } else {
 *   expr2;
 * }
 *
 * // After
 * cond ? expr1 : expr2;
 * ```
 *
 * @example
 * ```ts
 * // Before
 * if (cond) expr1; else expr2;
 *
 * // After
 * cond ? expr1 : expr2;
 * ```
 */
export const ifToTernarySideEffect = U.IfStatement({
  test: $,
  consequent: anyExprForm,
  alternate: anyExprForm,
})
  .to((bag) =>
    U.ExpressionStatement({
      expression: U.ConditionalExpression(bag),
    }),
  )
  .message("Collapse if/else side-effect into ternary expression")
  .recommended();
