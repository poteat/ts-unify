import type { BuilderMap } from "@/ast";
import { $ } from "@/capture";

declare const U: BuilderMap;

const anyExprForm = U.or(
  U.BlockStatement({
    body: [U.ExpressionStatement({ expression: $ })],
  }),
  U.ExpressionStatement({ expression: $ })
).seal();

/**
 * If both branches are side-effect expressions, convert to a single expression
 * statement with a ternary expression.
 *
 * @example
 * ```ts
 * if (cond) {
 *   expr1;
 * } else {
 *   expr2;
 * }
 * ```
 *
 * becomes
 *
 * ```ts
 * cond ? expr1 : expr2;
 * ```
 *
 * Also works with blockless forms:
 *
 * ```ts
 * if (cond) expr1; else expr2;
 * // → cond ? expr1 : expr2;
 * ```
 */
export const ifToTernarySideEffect = U.IfStatement({
  test: $,
  consequent: anyExprForm,
  alternate: anyExprForm,
}).to((bag) =>
  U.ExpressionStatement({
    expression: U.ConditionalExpression(bag),
  })
);
