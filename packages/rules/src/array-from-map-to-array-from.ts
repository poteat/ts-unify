import type { BuilderMap } from "@/ast";
import { $ } from "@/capture";

declare const U: BuilderMap;

/**
 * Collapse Array.from(x).map(fn) into Array.from(x, fn)
 *
 * Transforms:
 *   Array.from(iterable).map(mapFn)
 * Into:
 *   Array.from(iterable, mapFn)
 */
export const arrayFromMapToArrayFrom = U.CallExpression({
  callee: U.MemberExpression({
    object: U.CallExpression({
      callee: U.MemberExpression({
        object: U.Identifier({ name: "Array" }),
        property: U.Identifier({ name: "from" }),
        computed: false,
        optional: false,
      }),
      arguments: [$("iterable")],
      optional: false,
    }),
    property: U.Identifier({ name: "map" }),
    computed: false,
    optional: false,
  }),
  arguments: [$("mapFn")],
  optional: false,
}).to(({ iterable, mapFn }) =>
  U.CallExpression({
    callee: U.MemberExpression({
      object: U.Identifier({ name: "Array" }),
      property: U.Identifier({ name: "from" }),
      computed: false,
      optional: false,
    }),
    arguments: [iterable, mapFn],
    optional: false,
  })
);
