import { BuilderMap } from "@/ast";
import { $ } from "@/capture";

declare const U: BuilderMap;

const anyReturnForm = U.or(
  U.BlockStatement({
    body: [U.ReturnStatement({ argument: $ })],
  }),
  U.ReturnStatement({ argument: $ })
)
  .defaultUndefined()
  .seal();

/**
 * If both branches are return statements, convert to a single return with
 * a ternary expression.
 *
 * @example
 * ```ts
 * if (cond) {
 *   return expr1;
 * } else {
 *   return expr2;
 * }
 * ```
 *
 * becomes
 *
 * ```ts
 * return cond ? expr1 : expr2;
 * ```
 *
 * Also works with blockless returns:
 *
 * ```ts
 * if (cond) return expr1
 * else return expr2;
 * ```
 *
 * or variants thereof.
 */
export const ifReturnToTernary = U.IfStatement({
  test: $,
  consequent: anyReturnForm,
  alternate: anyReturnForm,
}).to((bag) => U.ReturnStatement({ argument: U.ConditionalExpression(bag) }));
