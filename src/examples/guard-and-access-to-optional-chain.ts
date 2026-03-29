import type { BuilderMap } from "@/ast";
import { $ } from "@/capture";

declare const U: BuilderMap;

/**
 * Replace guard-and-access with optional chaining
 *
 * Transforms:
 *   obj && obj.prop
 * Into:
 *   obj?.prop
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
);
