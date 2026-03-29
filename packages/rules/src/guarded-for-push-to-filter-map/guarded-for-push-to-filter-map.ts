import type { BuilderMap } from "@/ast";
import { $ } from "@/capture";

declare const U: BuilderMap;

/**
 * Transform guarded for-loops with push into filter().map() chains
 *
 * Transforms:
 *   const result: T = [];
 *   for (const item of items) {
 *     if (condition(item)) {
 *       result.push(transform(item));
 *     }
 *   }
 *
 * Into:
 *   const result = items
 *     .filter(item => condition(item))
 *     .map(item => transform(item));
 */

// `result.push(value)` as a statement (allow block or bare via maybeBlock)
const pushStatement = U.maybeBlock(
  U.ExpressionStatement({
    expression: U.CallExpression({
      callee: U.MemberExpression({
        object: $("arrayId"),
        property: U.Identifier({ name: "push" }),
      }),
      arguments: [$("pushValue")],
    }),
  })
);

// for (const loopVar of source) { if (condition) { result.push(value) } }
const guardedFor = U.ForOfStatement({
  left: U.VariableDeclaration({
    kind: "const",
    declarations: [U.VariableDeclarator({ id: $("loopVar") })],
  }),
  right: $("source"),
  body: U.maybeBlock(
    U.IfStatement({
      test: $("condition"),
      consequent: pushStatement,
      alternate: null,
    })
  ),
});

// const result: T = []
const emptyArrayDecl = U.VariableDeclaration({
  kind: "const",
  declarations: [
    U.VariableDeclarator({
      id: $("arrayId"),
      init: U.ArrayExpression({ elements: [] }),
    }),
  ],
});

export const guardedForPushToFilterMap = U.BlockStatement({
  body: [...$("before"), emptyArrayDecl, guardedFor, ...$("after")],
}).to(({ before, after, arrayId, loopVar, source, condition, pushValue }) => {
  const filterCall = U.CallExpression({
    callee: U.MemberExpression({
      object: source,
      property: U.Identifier({ name: "filter" }),
    }),
    arguments: [
      U.ArrowFunctionExpression({ params: [loopVar], body: condition }),
    ],
  });

  const mapCall = U.CallExpression({
    callee: U.MemberExpression({
      object: filterCall,
      property: U.Identifier({ name: "map" }),
    }),
    arguments: [
      U.ArrowFunctionExpression({ params: [loopVar], body: pushValue }),
    ],
  });

  const newDecl = U.VariableDeclaration({
    kind: "const",
    declarations: [U.VariableDeclarator({ id: arrayId, init: mapCall })],
  });

  return U.BlockStatement({ body: [...before, newDecl, ...after] });
});
