import type { BuilderMap } from "@/ast";
import { $ } from "@/capture";

declare const U: BuilderMap;

const returnFallback = U.ReturnStatement({ argument: $("fallback") });

const nullCheck = U.IfStatement({
  test: U.BinaryExpression({
    operator: "===",
    left: $("value"),
    right: U.Literal({ value: null }),
  }),
  consequent: U.or(
    U.BlockStatement({
      body: [returnFallback],
    }),
    returnFallback
  ).truthy(),
  alternate: null,
});

const returnOfValue = U.or(
  U.ReturnStatement({ argument: $("value") }),
  U.ReturnStatement({
    argument: U.TSAsExpression({
      expression: $("value"),
      typeAnnotation: $,
    }),
  })
);

/**
 * Collapse null guard with early return into nullish coalescing.
 *
 * Precondition: `value` has type `T | null` where `T` never includes
 * `undefined`. Using `??` checks for `null | undefined`.
 *
 * @example
 * ```ts
 * if (value === null) return def;
 * return value;
 * // → return value ?? def;
 * ```
 *
 * Also preserves type assertions:
 * ```ts
 * if (value === null) return def;
 * return value as T;
 * // → return (value ?? def) as T;
 * ```
 */
export const collapseNullGuard = U.BlockStatement({
  body: [...$, nullCheck, returnOfValue],
}).to(({ body, value: left, fallback: right, typeAnnotation }) => {
  const coalesce = U.LogicalExpression({
    operator: "??",
    left,
    right,
  });

  const argument = typeAnnotation
    ? U.TSAsExpression({ expression: coalesce, typeAnnotation })
    : coalesce;

  return U.BlockStatement({
    body: [
      ...body,
      U.ReturnStatement({
        argument,
      }),
    ],
  });
});
