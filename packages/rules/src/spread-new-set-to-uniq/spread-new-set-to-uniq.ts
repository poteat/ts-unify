import { $ } from "@/capture";
import { U } from "@/ast";

/**
 * Replace [...new Set(array)] with uniq(array)
 *
 * @example
 * ```ts
 * // Before
 * [...new Set(myArray)]
 *
 * // After
 * uniq(myArray)
 * ```
 */
export const spreadNewSetToUniq = U.ArrayExpression({
  elements: [
    U.SpreadElement({
      argument: U.NewExpression({
        callee: U.Identifier({ name: "Set" }),
        arguments: [$("array")],
      }),
    }),
  ],
})
  .to(({ array }) =>
    U.CallExpression({
      callee: U.Identifier({ name: "uniq" }),
      arguments: [array],
    })
  )
  .imports({ uniq: "my-utils/uniq" });
