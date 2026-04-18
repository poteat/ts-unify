import { NODE, CONFIG_BRAND } from "@ts-unify/core/internal";
import type { ProxyNode, ChainEntry } from "@ts-unify/core/internal";
import { matchWithSites, applyRewrites, symGet } from "@ts-unify/engine";
import { extractRuleMeta } from "@ts-unify/runner";
import type { TSESTree } from "@typescript-eslint/types";
import type { RuleModule } from "../rule-module";
import type { TransformLike } from "../transform-like";
import { print } from "recast";

/**
 * Resolve config slot values in an imports map against config defaults.
 * Returns a map of `{ specifier: modulePath }`.
 */
function resolveImports(chain: ChainEntry[]): Record<string, string> | null {
  const importsEntry = chain.find((c) => c.method === "imports");
  if (!importsEntry) return null;

  const configEntry = chain.find((c) => c.method === "config");
  const configDefaults: Record<string, unknown> =
    (configEntry?.args[0] as Record<string, unknown>) ?? {};

  const raw = importsEntry.args[0] as Record<string, unknown>;
  const resolved: Record<string, string> = {};
  for (const [specifier, value] of Object.entries(raw)) {
    if (typeof value === "string") {
      resolved[specifier] = value;
    } else if (value && typeof value === "object" && symGet(value, CONFIG_BRAND) === true) {
      const slotName = (value as { name: string }).name;
      const defaultVal = configDefaults[slotName];
      if (typeof defaultVal === "string") {
        resolved[specifier] = defaultVal;
      }
    }
  }
  return Object.keys(resolved).length > 0 ? resolved : null;
}

/**
 * Build an import statement string from a resolved imports map.
 * Produces `import { specifier1, specifier2 } from "module";\n` for each
 * unique module path.
 */
function buildImportStatements(imports: Record<string, string>): string {
  // Group specifiers by module path
  const byModule: Record<string, string[]> = {};
  for (const [specifier, modulePath] of Object.entries(imports)) {
    if (!byModule[modulePath]) byModule[modulePath] = [];
    byModule[modulePath].push(specifier);
  }
  const stmts: string[] = [];
  for (const [modulePath, specifiers] of Object.entries(byModule)) {
    stmts.push(`import { ${specifiers.join(", ")} } from "${modulePath}";\n`);
  }
  return stmts.join("");
}

/** Check if any pattern entry contains a proxy with `.to()` anywhere. */
function patternContainsInnerTo(
  entries: { tag: string; pattern: Record<string, unknown>; chain: ChainEntry[] }[],
): boolean {
  function walk(v: unknown): boolean {
    if (v == null) return false;
    // Proxy nodes are functions — check before the typeof === "object" gate.
    if (typeof v === "function" && symGet(v, NODE)) {
      const pn = symGet(v, NODE) as ProxyNode;
      if (pn.chain.some((c: ChainEntry) => c.method === "to")) return true;
      return pn.args.some(walk);
    }
    if (typeof v !== "object") return false;
    if (Array.isArray(v)) return v.some(walk);
    return Object.values(v as Record<string, unknown>).some(walk);
  }
  return entries.some((e) => walk(e.pattern));
}

/** Compile an AstTransform into an ESLint rule module. */
export function createRule(
  transform: TransformLike,
  opts: { message?: string; fix?: boolean } = {},
): RuleModule {
  const meta = extractRuleMeta("", transform);
  const entries = meta.patterns;
  const message = opts.message ?? meta.message;
  const factory = opts.fix === false ? null : meta.factory;
  const withEntries = meta.withs;

  const proxyNode = symGet(transform, NODE) as ProxyNode | undefined;

  // The rule is fixable if the proxy chain has a top-level `.to()`
  // (factory != null) or any sub-pattern carries a `.to()` site.
  const hasInnerRewrites = patternContainsInnerTo(entries);

  // Pre-resolve imports from the top-level chain
  const importMap = proxyNode?.chain ? resolveImports(proxyNode.chain) : null;

  return {
    meta: {
      type: "suggestion",
      ...(factory || hasInnerRewrites ? { fixable: "code" as const } : {}),
      messages: { match: message },
    },
    create(context) {
      const visitors: Record<string, (node: TSESTree.Node) => void> = {};
      const sourceCode = context.sourceCode ?? context.getSourceCode?.();

      for (const { tag, pattern, chain } of entries) {
        visitors[tag] = (node: TSESTree.Node) => {
          const result = matchWithSites(node, pattern, chain);
          if (!result) return;
          const bag = result.bag;
          const data: Record<string, string> = {};
          for (const [k, v] of Object.entries(bag)) {
            data[k] =
              typeof v === "object" &&
              v !== null &&
              "type" in v &&
              v.type === "Identifier" &&
              "name" in v
                ? String(v.name)
                : String(v);
          }
          // For OR-rooted rules, the per-branch chain doesn't carry the
          // outer `.to()`. extractRuleMeta extracts it as `factory`; inject
          // it as a root site if matchWithSites didn't already.
          const sites = [...result.sites];
          if (factory && !sites.some((s) => s.path.length === 0)) {
            sites.push({ path: [], factory, scopeBag: bag });
          }
          const canFix = sites.length > 0;

          context.report({
            node,
            messageId: "match",
            data,
            ...(canFix
              ? {
                  fix(fixer) {
                    // Apply withs in place so all sites see the extra fields.
                    if (withEntries.length > 0) {
                      let b: Record<string, unknown> = bag;
                      for (const w of withEntries) b = { ...b, ...w(b) };
                      for (const k of Object.keys(b)) bag[k] = b[k];
                    }

                    // canFix gated this branch on sites.length > 0, so
                    // applyRewrites returns non-null.
                    const rewritten = applyRewrites(node, sites, result.capturePaths, sourceCode);
                    const text = print(rewritten as Parameters<typeof print>[0]).code;

                    // If imports are specified, prepend missing ones to the file
                    if (importMap) {
                      const fullSource = sourceCode?.getText?.() ?? "";
                      const missingImports: Record<string, string> = {};
                      for (const [specifier, modulePath] of Object.entries(importMap)) {
                        // Simple heuristic: check if an import of this specifier from this module exists
                        const importPattern = new RegExp(
                          `import\\s+\\{[^}]*\\b${specifier}\\b[^}]*\\}\\s+from\\s+["']${modulePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`,
                        );
                        if (!importPattern.test(fullSource)) {
                          missingImports[specifier] = modulePath;
                        }
                      }
                      if (Object.keys(missingImports).length > 0) {
                        const insertText = buildImportStatements(missingImports);
                        return [
                          fixer.insertTextBeforeRange([0, 0], insertText),
                          fixer.replaceText(node, text),
                        ];
                      }
                    }

                    return fixer.replaceText(node, text);
                  },
                }
              : {}),
          });
        };
      }

      return visitors;
    },
  };
}
