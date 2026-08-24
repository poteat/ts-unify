import { U, $ } from "@ts-unify/core";

type Node = { type: string; [k: string]: unknown };

const isNode = (v: unknown): v is Node =>
  typeof v === "object" && v !== null && typeof (v as Node).type === "string";

/**
 * Every node under a tree, depth first, with its parent; the walk follows
 * the parser's child keys and never `parent`.
 */
function* walk(tree: unknown, parent: Node | null = null): Generator<[Node, Node | null]> {
  if (Array.isArray(tree)) {
    for (const v of tree) yield* walk(v, parent);
    return;
  }
  if (!isNode(tree)) return;
  yield [tree, parent];
  for (const [k, v] of Object.entries(tree)) {
    if (k === "parent" || k === "loc" || k === "range") continue;
    yield* walk(v, tree);
  }
}

const FUNCTIONS = new Set(["ArrowFunctionExpression", "FunctionExpression", "FunctionDeclaration"]);
const LOOPS = new Set(["ForStatement", "ForInStatement", "ForOfStatement", "WhileStatement", "DoWhileStatement"]);
const EFFECTS = new Set([
  "CallExpression", "NewExpression", "AwaitExpression", "YieldExpression",
  "AssignmentExpression", "UpdateExpression", "TaggedTemplateExpression",
]);

/**
 * Whether an identifier node is a binding, a key, a label or a type
 * position: a same-named identifier there is not a read of the const.
 */
function notARead(id: Node, parent: Node | null): boolean {
  if (parent === null) return false;
  const p = parent;
  if ((p.type === "Property" || p.type === "PropertyDefinition" || p.type === "MethodDefinition") && p.key === id && !p.computed) return true;
  if (p.type === "MemberExpression" && p.property === id && !p.computed) return true;
  if (p.type === "VariableDeclarator" && p.id === id) return true;
  if (FUNCTIONS.has(p.type) && Array.isArray(p.params) && p.params.includes(id)) return true;
  if (p.type === "ArrayPattern" || p.type === "ObjectPattern" || p.type === "RestElement") return true;
  if (p.type === "AssignmentPattern" && p.left === id) return true;
  if (p.type === "CatchClause" && p.param === id) return true;
  if (p.type === "LabeledStatement" || p.type === "BreakStatement" || p.type === "ContinueStatement") return true;
  if (p.type === "ImportSpecifier" || p.type === "ImportDefaultSpecifier" || p.type === "ImportNamespaceSpecifier" || p.type === "ExportSpecifier") return true;
  if (p.type.startsWith("TS")) return true;
  return false;
}

/**
 * Whether a same-named binding is made anywhere under a tree: a parameter,
 * a declarator, a pattern element, a catch parameter, a function's name.
 */
function rebinds(tree: unknown, name: string): boolean {
  for (const [n, parent] of walk(tree)) {
    if (n.type !== "Identifier" || n.name !== name) continue;
    if (parent === null) continue;
    if (parent.type === "VariableDeclarator" && parent.id === n) return true;
    if (FUNCTIONS.has(parent.type) && (parent.id === n || (Array.isArray(parent.params) && parent.params.includes(n)))) return true;
    if (parent.type === "ArrayPattern" || parent.type === "RestElement") return true;
    if (parent.type === "Property" && parent.value === n && parent.shorthand) {
      const holder = [...walk(tree)].find(([m]) => m.type === "ObjectPattern" && Array.isArray(m.properties) && m.properties.includes(parent));
      if (holder !== undefined) return true;
    }
    if (parent.type === "Property" && parent.value === n && !parent.shorthand) {
      const holder = [...walk(tree)].find(([m]) => m.type === "ObjectPattern" && Array.isArray(m.properties) && m.properties.includes(parent));
      if (holder !== undefined) return true;
    }
    if (parent.type === "AssignmentPattern" && parent.left === n) return true;
    if (parent.type === "CatchClause" && parent.param === n) return true;
  }
  return false;
}

/**
 * Whether a type position names the const (`typeof x`): a reference that
 * cannot take the initializer's place, so the declaration stays.
 */
const namedInType = (tree: unknown, name: string): boolean =>
  [...walk(tree)].some(
    ([n, parent]) =>
      n.type === "Identifier" && n.name === name && parent !== null && parent.type.startsWith("TS"),
  );

/**
 * The read identifiers of a name under a tree, each with the chain of
 * nodes above it within the tree (innermost last).
 */
function readsOf(tree: unknown, name: string): { node: Node; above: Node[] }[] {
  const found: { node: Node; above: Node[] }[] = [];
  const visit = (t: unknown, above: Node[]): void => {
    if (Array.isArray(t)) {
      for (const v of t) visit(v, above);
      return;
    }
    if (!isNode(t)) return;
    const parent = above[above.length - 1] ?? null;
    if (t.type === "Identifier" && t.name === name) {
      if (!notARead(t, parent)) found.push({ node: t, above });
      return;
    }
    for (const [k, v] of Object.entries(t)) {
      if (k === "parent" || k === "loc" || k === "range") continue;
      visit(v, [...above, t]);
    }
  };
  visit(tree, []);
  return found;
}

const range = (n: Node): [number, number] => n.range as [number, number];

const hasEffects = (tree: unknown): boolean =>
  [...walk(tree)].some(([n]) => EFFECTS.has(n.type));

/**
 * Whether substituting `init` for one read changes when `init` runs, or
 * what the statement reads like: the read sits in a nested function, a
 * loop, a shorthand property, a template literal's hole (a fragment keeps
 * its name), or — for an `init` with effects — after another effect or
 * under a branch that may not be taken.
 */
function moves(read: { node: Node; above: Node[] }, stmt: Node, init: Node): boolean {
  const { node, above } = read;
  const parent = above[above.length - 1];
  if (parent !== undefined && parent.type === "Property" && parent.shorthand) return true;
  if (parent !== undefined && parent.type === "TemplateLiteral") return true;
  for (let i = 0; i < above.length; i++) {
    const a = above[i];
    if (FUNCTIONS.has(a.type)) return true;
    if (LOOPS.has(a.type)) return true;
  }
  if (!hasEffects(init)) return false;
  const [start] = range(node);
  for (const [n] of walk(stmt)) {
    if (n === node) continue;
    if (EFFECTS.has(n.type) && range(n)[1] <= start) return true;
  }
  for (let i = 0; i < above.length; i++) {
    const a = above[i];
    const below = above[i + 1] ?? node;
    if (a.type === "LogicalExpression" && a.right === below) return true;
    if (a.type === "ConditionalExpression" && a.test !== below) return true;
    if (a.type === "IfStatement" && a.test !== below) return true;
    if (a.type === "ChainExpression") return true;
    if (a.type === "SwitchStatement" && a.discriminant !== below) return true;
    if (a.type === "TryStatement") return true;
  }
  return false;
}

/**
 * The first const of a block that one read in the very next statement
 * consumes, with that read; null when there is none. Exported so a
 * wrapper can see which const a report is about.
 */
export function inlinableConst(body: unknown): { index: number; name: string; init: Node; read: Node } | null {
  if (!Array.isArray(body)) return null;
  for (let i = 0; i + 1 < body.length; i++) {
    const s = body[i];
    if (!isNode(s) || s.type !== "VariableDeclaration" || s.kind !== "const") continue;
    const decls = s.declarations;
    if (!Array.isArray(decls) || decls.length !== 1 || !isNode(decls[0])) continue;
    const d = decls[0];
    const id = d.id;
    const init = d.init;
    if (!isNode(id) || id.type !== "Identifier" || id.typeAnnotation !== undefined || !isNode(init)) continue;
    const name = id.name as string;
    const rest = body.slice(i + 1);
    if (rebinds(rest, name) || namedInType(rest, name)) continue;
    const reads = readsOf(rest, name);
    if (reads.length !== 1) continue;
    const stmt = body[i + 1];
    const [read] = reads;
    if (!isNode(stmt) || readsOf(stmt, name).length !== 1) continue;
    if (moves(read, stmt, init)) continue;
    return { index: i, name, init, read: read.node };
  }
  return null;
}

/**
 * A tree with one node, by identity, replaced.
 */
const substituted = <T>(tree: T, target: Node, replacement: Node): T => {
  if (tree === (target as unknown)) return replacement as T;
  if (Array.isArray(tree)) return tree.map((v) => substituted(v, target, replacement)) as T;
  if (!isNode(tree)) return tree;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(tree)) {
    out[k] = k === "parent" ? v : substituted(v, target, replacement);
  }
  return out as T;
};

/**
 * Inline a `const` binding whose one read is in the very next statement:
 * the declaration goes, and that read becomes the initializer.
 *
 * Every single-declarator `const` of the block is examined, first to last.
 * A read is counted by its role, not its name: a key, a member name, a
 * binding, a label or a type position is none; a same-named binding, or a
 * `typeof` of the name, anywhere after the declaration stops the inlining. The one read may not
 * sit inside a nested function or a loop (the initializer would run later,
 * or again), nor be a shorthand property, nor a template literal's hole (a
 * template is built from named fragments); and an initializer with effects
 * may not be moved past another effect or under a branch. An annotated
 * const keeps its check.
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
export const inlineSingleUseConst = U.BlockStatement({ body: $("body") })
  .when((bag) => inlinableConst((bag as { body?: unknown }).body) !== null)
  .to((bag) => {
    const body = (bag as { body?: unknown }).body;
    const it = inlinableConst(body);
    const list = body as unknown[];
    if (it === null) return { type: "BlockStatement", body: list };
    const next = substituted(list[it.index + 1], it.read, it.init);
    return {
      type: "BlockStatement",
      body: [...list.slice(0, it.index), next, ...list.slice(it.index + 2)],
    };
  })
  .message("Inline single-use const");
