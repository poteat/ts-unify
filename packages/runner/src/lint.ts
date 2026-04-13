import { match, reify } from "@ts-unify/engine";
import type { RuleMeta, Bag, Factory, WithFn } from "./extract-rule-meta";

export type LintMatch = {
  rule: string;
  message: string;
  line: number;
  column: number;
  endLine: number;
  endColumn: number;
  /** Reified output node from the rule's .to() factory, if any. */
  reified: unknown;
};

export type LintResult = {
  matches: LintMatch[];
  ast: unknown;
  error: string | null;
};

/**
 * Run the rule's .to() factory on a match bag and reify the result.
 * Returns the reified ESTree node, or null on failure.
 */
function renderReified(
  factory: Factory,
  withs: WithFn[],
  bag: Bag,
  kebab: string
): unknown {
  let b: Bag = bag;
  try {
    for (const w of withs) b = { ...b, ...w(b) };
    const output = factory(b);
    return reify(output);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`[ts-unify] rewrite failed for ${kebab}:`, e);
    return null;
  }
}

/**
 * Lint a pre-parsed AST against a set of rules. Returns all matches
 * with their reified output nodes (ready for serialization by the
 * consumer).
 */
export function lint(
  ast: unknown,
  rules: RuleMeta[]
): LintMatch[] {
  const found: LintMatch[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function walk(node: any, parent?: any) {
    if (!node || typeof node !== "object") return;
    if (node.type) {
      node.parent = parent;
      for (const { kebab, message, patterns, factory, withs } of rules) {
        for (const { tag, pattern, chain } of patterns) {
          if (node.type === tag) {
            const bag = match(node, pattern, chain);
            if (bag) {
              const reified = factory
                ? renderReified(factory, withs, bag as Bag, kebab)
                : null;
              found.push({
                rule: kebab,
                message,
                line: node.loc?.start?.line ?? 0,
                column: (node.loc?.start?.column ?? 0) + 1,
                endLine: node.loc?.end?.line ?? 0,
                endColumn: (node.loc?.end?.column ?? 0) + 1,
                reified,
              });
            }
          }
        }
      }
    }
    for (const key of Object.keys(node)) {
      if (key === "parent") continue;
      const child = node[key];
      if (Array.isArray(child)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        child.forEach((c: any) => walk(c, node));
      } else if (child?.type) walk(child, node);
    }
  }

  walk(ast);
  return found;
}
