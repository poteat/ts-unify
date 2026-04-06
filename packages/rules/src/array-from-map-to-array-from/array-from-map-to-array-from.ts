import { U, $ } from "@ts-unify/core";

/**
 * Collapse Array.from(x).map(fn) into Array.from(x, fn)
 *
 * @example
 * ```ts
 * // Before
 * Array.from(iterable).map(mapFn)
 *
 * // After
 * Array.from(iterable, mapFn)
 * ```
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
})
  .to(({ iterable, mapFn }) =>
    U.CallExpression({
      callee: U.MemberExpression({
        object: U.Identifier({ name: "Array" }),
        property: U.Identifier({ name: "from" }),
        computed: false,
        optional: false,
      }),
      arguments: [iterable, mapFn],
      optional: false,
    }),
  )
  .message("Collapse Array.from().map() into Array.from(_, mapFn)")
  .recommended();
