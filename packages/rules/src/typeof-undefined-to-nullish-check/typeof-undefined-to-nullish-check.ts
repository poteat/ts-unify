import { U, $ } from "@ts-unify/core";

/**
 * Replace typeof x === "undefined" with x == null
 *
 * @example
 * ```ts
 * // Before
 * typeof x === "undefined"
 *
 * // After
 * x == null
 * ```
 */
export const typeofUndefinedToNullishCheck = U.BinaryExpression({
  operator: U.or("===", "=="),
  left: U.UnaryExpression({
    operator: "typeof",
    argument: $("expr"),
  }),
  right: U.Literal({ value: "undefined" }),
})
  .to(({ expr }) =>
    U.BinaryExpression({
      operator: "==",
      left: expr,
      right: U.Literal({ value: null }),
    }),
  )
  .message("Use == null instead of typeof === 'undefined'")
  .recommended();
