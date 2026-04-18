import { matchWithSites, applyRewrites } from "@ts-unify/engine";
import type { RuleMeta, Bag, WithFn } from "./extract-rule-meta";

export type LintMatch = {
  rule: string;
  message: string;
  line: number;
  column: number;
  endLine: number;
  endColumn: number;
  /** Reified output node from the rule's rewrite, if any. */
  reified: unknown;
};

export type LintResult = {
  matches: LintMatch[];
  ast: unknown;
  error: string | null;
};

/**
 * Apply `with()` callbacks to a bag in chain order, accumulating their
 * returned overlays. Used to feed extra fields into the bag before any
 * `.to()` factories run.
 */
function applyWiths(bag: Bag, withs: WithFn[]): Bag {
  let b: Bag = bag;
  for (const w of withs) b = { ...b, ...w(b) };
  return b;
}

/**
 * Lint a pre-parsed AST against a set of rules. Returns all matches with
 * their reified output nodes (ready for serialization by the consumer).
 *
 * Rewrites — root-level `.to()` and any inner `.to()` sites — are applied
 * in a single bottom-up pass via the engine's `applyRewrites`.
 */
export function lint(ast: unknown, rules: RuleMeta[]): LintMatch[] {
  const found: LintMatch[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function walk(node: any, parent?: any) {
    if (!node || typeof node !== "object") return;
    if (node.type) {
      node.parent = parent;
      for (const { kebab, message, patterns, factory, withs } of rules) {
        for (const { tag, pattern, chain } of patterns) {
          if (node.type !== tag) continue;
          const result = matchWithSites(node, pattern, chain);
          if (!result) continue;

          // Apply withs to the bag in place so all sites (including the
          // root `.to()` site) see the extra fields.
          if (withs.length > 0) {
            const transformed = applyWiths(result.bag, withs);
            for (const k of Object.keys(transformed)) {
              result.bag[k] = transformed[k];
            }
          }

          // For OR-rooted rules, the per-branch chain doesn't carry the
          // outer `.to()` — extractRuleMeta extracts it as `factory`.
          // Inject it as a root site if matchWithSites didn't already.
          const sites = [...result.sites];
          if (factory && !sites.some((s) => s.path.length === 0)) {
            sites.push({ path: [], factory, scopeBag: result.bag });
          }

          let reified: unknown = null;
          try {
            reified = applyRewrites(node, sites, result.capturePaths);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn(`[ts-unify] rewrite failed for ${kebab}:`, e);
            reified = null;
          }

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
