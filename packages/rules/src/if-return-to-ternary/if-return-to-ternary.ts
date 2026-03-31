import { U } from "@/ast";
import { $ } from "@/capture";

const anyReturnForm = U.maybeBlock(U.ReturnStatement({ argument: $ }))
  .defaultUndefined()
  .seal();

/**
 * If both branches are return statements, convert to a single return with
 * a ternary expression.
 *
 * @example
 * ```ts
 * // Before
 * if (cond) {
 *   return expr1;
 * } else {
 *   return expr2;
 * }
 *
 * // After
 * return cond ? expr1 : expr2;
 * ```
 *
 * @example
 * ```ts
 * // Before
 * if (cond) return expr1
 * else return expr2;
 *
 * // After
 * return cond ? expr1 : expr2;
 * ```
 */
export const ifReturnToTernary = U.IfStatement({
  test: $,
  consequent: anyReturnForm,
  alternate: anyReturnForm,
}).to((bag) => U.ReturnStatement({ argument: U.ConditionalExpression(bag) })).recommended();
