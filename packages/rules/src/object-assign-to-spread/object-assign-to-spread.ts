import { $ } from "@/capture";
import { U } from "@/ast";

/**
 * Replace Object.assign with spread syntax
 *
 * @example
 * ```ts
 * // Before
 * Object.assign({}, a, b)
 *
 * // After
 * { ...a, ...b }
 * ```
 */
export const objectAssignToSpread = U.CallExpression({
  callee: U.MemberExpression({
    object: U.Identifier({ name: "Object" }),
    property: U.Identifier({ name: "assign" }),
    computed: false,
    optional: false,
  }),
  arguments: [U.ObjectExpression({ properties: [] }), ...$("sources")],
  optional: false,
}).to(({ sources }) =>
  U.ObjectExpression({
    properties: sources.map((src) =>
      U.SpreadElement({ argument: src })
    ),
  })
);
