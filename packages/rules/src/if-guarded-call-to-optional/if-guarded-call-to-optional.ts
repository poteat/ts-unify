import { $ } from "@/capture";
import { U } from "@/ast";

const callConsequent = U.maybeBlock(
  U.ExpressionStatement({
    expression: U.CallExpression({
      callee: $,
      arguments: $("args"),
    }),
  })
);

/**
 * Transform if-guarded function calls into optional chaining
 *
 * Transforms:
 *   if (func) {
 *     func(arg1, arg2);
 *   }
 *
 * Into:
 *   func?.(arg1, arg2);
 */
export const ifGuardedCallToOptional = U.IfStatement({
  test: $("callee"),
  consequent: callConsequent,
  alternate: null,
}).to(({ callee, args }) =>
  U.ExpressionStatement({
    expression: U.ChainExpression({
      expression: U.CallExpression({
        callee,
        arguments: args,
        optional: true,
      }),
    }),
  })
);
