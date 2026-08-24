import { U, $ } from "@ts-unify/core";

/**
 * Whether a tree reads a name: any Identifier node of that name under it,
 * a declaration's own annotated identifier and a destructuring pattern
 * being nodes of other shapes.
 */
const readsName = (tree: unknown, name: string): boolean => {
  if (tree == null || typeof tree !== "object") return false;
  if (Array.isArray(tree)) return tree.some((v) => readsName(v, name));
  const rec = tree as Record<string, unknown>;
  if (rec.type === "Identifier" && rec.name === name) return true;
  return Object.entries(rec).some(
    ([k, v]) => k !== "parent" && k !== "loc" && k !== "range" && readsName(v, name)
  );
};

/**
 * A tree with every bare read of a name replaced.
 */
const subName = <T>(tree: T, name: string, replacement: unknown): T => {
  if (tree == null || typeof tree !== "object") return tree;
  if (Array.isArray(tree)) return tree.map((v) => subName(v, name, replacement)) as T;
  const rec = tree as Record<string, unknown>;
  if (rec.type === "Identifier" && rec.name === name) return replacement as T;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(rec)) {
    out[k] = k === "parent" ? v : subName(v, name, replacement);
  }
  return out as T;
};

/**
 * Inline a `const` binding that is declared and immediately used in the
 * very next statement. Substitutes the identifier with the initializer.
 *
 * The binding is a plain identifier (a destructuring const binds several
 * names and cannot be substituted), the next statement reads it once, and
 * no later statement does; reads are found by name, so a type annotation
 * on the declaration does not hide them.
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
    U.seq(
      U.VariableDeclaration({
        kind: "const",
        declarations: [U.VariableDeclarator({ id: $("id"), init: $("init") })],
      }),
      $("stmt"),
    ).to(({ stmt, id, init }) =>
      subName(stmt, (id as { name: string }).name, init)
    ),
    ...$("after"),
  ],
})
  .when(({ id, stmt, after }) => {
    if (id.type !== "Identifier") return false;
    return readsName(stmt, id.name) && !readsName(after, id.name);
  })
  .message("Inline single-use const");
