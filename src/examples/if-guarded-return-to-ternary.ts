import type { BuilderMap } from "@/ast";
import { $ } from "@/capture";

declare const U: BuilderMap;

const returnArg = U.ReturnStatement({ argument: $ }).map(
  (x) => x ?? U.Identifier({ name: "undefined" })
);

const guardedReturn = U.or(
  U.BlockStatement({
    body: [returnArg],
  }),
  returnArg
).seal();

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
      consequent: guardedReturn,
      alternate: null,
    }),
    U.ReturnStatement({ argument: $("alternate") }).map(
      (x) => x ?? U.Identifier({ name: "undefined" })
    ),
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
