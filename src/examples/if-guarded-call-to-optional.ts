import type { BuilderMap } from "@/ast";
import { $ } from "@/capture";

declare const U: BuilderMap;

const callConsequent = U.or(
  U.BlockStatement({
    body: [
      U.ExpressionStatement({
        expression: U.CallExpression({
          callee: $("fn"),
          arguments: $("args"),
        }),
      }),
    ],
  }),
  U.ExpressionStatement({
    expression: U.CallExpression({
      callee: $("fn"),
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
  test: $("fn"),
  consequent: callConsequent,
  alternate: null,
}).to(({ fn, args }) =>
  U.ExpressionStatement({
    expression: U.ChainExpression({
      expression: U.CallExpression({
        callee: fn,
        arguments: args,
        optional: true,
      }),
    }),
  })
);
