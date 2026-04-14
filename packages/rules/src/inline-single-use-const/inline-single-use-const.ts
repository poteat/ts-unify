import { U, $ } from "@ts-unify/core";
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
const seqRewrite = U.seq(
  U.VariableDeclaration({
    kind: "const",
    declarations: [U.VariableDeclarator({ id: $("id"), init: $("init") })],
  }),
  $("stmt"),
).to(({ stmt, id, init }) => sub(stmt, id, init));

export const inlineSingleUseConst = U.BlockStatement({
  body: [
    ...$("before"),
    seqRewrite,
    ...$("after"),
  ],
})
  .when(({ id, after }) => !contains(after, id))
  .message("Inline single-use const");
