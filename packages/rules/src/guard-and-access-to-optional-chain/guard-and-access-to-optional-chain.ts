import { $ } from "@/capture";
import { U } from "@/ast";

/**
 * Replace guard-and-access with optional chaining
 *
 * @example
 * ```ts
 * // Before
 * obj && obj.prop
 *
 * // After
 * obj?.prop
 * ```
 */
export const guardAndAccessToOptionalChain = U.LogicalExpression({
  operator: "&&",
  left: $("obj"),
  right: U.MemberExpression({
    object: $("obj"),
    property: $("prop"),
    computed: false,
    optional: false,
  }),
}).to(({ obj, prop }) =>
  U.ChainExpression({
    expression: U.MemberExpression({
      object: obj,
      property: prop,
      computed: false,
      optional: true,
    }),
  })
).recommended();
