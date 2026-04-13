import { U, $ } from "@ts-unify/core";
import type { TSESTree } from "@typescript-eslint/types";
import { sub, contains } from "@ts-unify/engine";

/**
 * Inline a `const` binding that is declared and immediately used in the
 * very next statement. Substitutes the identifier with the initializer.
 *
 * @example
 * ```ts
 * // Before
 * const handler = config.onError;
 * handler?.(err);
 *
 * // After
 * config.onError?.(err);
 * ```
 */
export const inlineSingleUseConst = U.BlockStatement({
  body: [
    ...$("before"),
    U.VariableDeclaration({
      kind: "const",
      declarations: [U.VariableDeclarator({ id: $("id"), init: $("init") })],
    }),
    $("stmt"),
    ...$("after"),
  ],
})
  .when(({ id, after }) => !contains(after, id))
  .to(({ before, after, id, init, stmt }) =>
    U.BlockStatement({
      body: [...(before as TSESTree.Statement[]), sub(stmt, id, init) as TSESTree.Statement, ...(after as TSESTree.Statement[])],
    })
  )
  .message("Inline single-use const");
