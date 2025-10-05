import type { BuilderMap } from "@/ast";
import { $ } from "@/capture";

declare const U: BuilderMap;

const anyReturnForm = U.maybeBlock(U.ReturnStatement({ argument: $ }))
  .defaultUndefined()
  .seal();

/**
 * Collapse if-guarded return patterns into ternary expressions
 *
 * Transforms:
 *   if (condition) {
 *     return valueA;
 *   }
 *   return valueB;
 *
 * Into:
 *   return condition ? valueA : valueB;
 *
 * Also handles non-block if statements:
 *   if (condition) return valueA;
 *   return valueB;
 */
export const ifGuardedReturnToTernary = U.BlockStatement({
  body: [
    ...$("pre"),
    U.IfStatement({
      test: $,
      consequent: anyReturnForm,
      alternate: null,
    }),
    U.ReturnStatement({ argument: $("alternate") }).defaultUndefined(),
  ],
}).to(({ pre, test, consequent, alternate }) =>
  U.BlockStatement({
    body: [
      ...pre,
      U.ReturnStatement({
        argument: U.ConditionalExpression({
          test,
          consequent,
          alternate,
        }),
      }),
    ],
  })
);
