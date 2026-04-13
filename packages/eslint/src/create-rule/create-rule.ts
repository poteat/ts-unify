import { NODE, CONFIG_BRAND } from "@ts-unify/core/internal";
import type { ProxyNode, ChainEntry } from "@ts-unify/core/internal";
import { match, reify, extractPatterns, symGet } from "@ts-unify/engine";
import type { TSESTree } from "@typescript-eslint/types";
import type { RuleModule } from "../rule-module";
import type { TransformLike } from "../transform-like";
import { print } from "recast";

/**
 * Resolve config slot values in an imports map against config defaults.
 * Returns a map of `{ specifier: modulePath }`.
 */
function resolveImports(
  chain: ChainEntry[]
): Record<string, string> | null {
  const importsEntry = chain.find((c) => c.method === "imports");
  if (!importsEntry) return null;

  const configEntry = chain.find((c) => c.method === "config");
  const configDefaults: Record<string, unknown> = (configEntry?.args[0] as Record<string, unknown>) ?? {};

  const raw = importsEntry.args[0] as Record<string, unknown>;
  const resolved: Record<string, string> = {};
  for (const [specifier, value] of Object.entries(raw)) {
    if (typeof value === "string") {
      resolved[specifier] = value;
    } else if (
      value &&
      typeof value === "object" &&
      symGet(value, CONFIG_BRAND) === true
    ) {
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

/** Compile an AstTransform into an ESLint rule module. */
export function createRule(
  transform: TransformLike,
  opts: { message?: string; fix?: boolean } = {}
): RuleModule {
  const entries = extractPatterns(transform);

  const proxyNode = symGet(transform, NODE) as ProxyNode | undefined;
  const messageEntry = proxyNode?.chain?.find(
    (c: ChainEntry) => c.method === "message"
  );
  const message =
    opts.message ?? (messageEntry?.args[0] as string | undefined) ?? "Matches a ts-unify pattern";
  const toEntry = proxyNode?.chain?.find(
    (c: ChainEntry) => c.method === "to"
  );
  // Per node-with-to.spec.md: zero-arg .to() means "output is the
  // single capture value". Synthesize an identity factory for it.
  let factory: ((bag: Record<string, unknown>) => unknown) | null = null;
  if (opts.fix !== false && toEntry) {
    factory = toEntry.args[0]
      ? (toEntry.args[0] as (bag: Record<string, unknown>) => unknown)
      : (bag: Record<string, unknown>) => Object.values(bag)[0];
  }

  // Collect .with() entries that appear before .to() in the chain
  const withEntries: ChainEntry[] = [];
  if (factory && proxyNode?.chain) {
    for (const entry of proxyNode.chain) {
      if (entry.method === "to") break;
      if (entry.method === "with") withEntries.push(entry);
    }
  }

  // Pre-resolve imports from the top-level chain
  const importMap = proxyNode?.chain
    ? resolveImports(proxyNode.chain)
    : null;

  return {
    meta: {
      type: "suggestion",
      ...(factory ? { fixable: "code" as const } : {}),
      messages: { match: message },
    },
    create(context) {
      const visitors: Record<string, (node: TSESTree.Node) => void> = {};
      const sourceCode = context.sourceCode ?? context.getSourceCode?.();

      for (const { tag, pattern, chain } of entries) {
        visitors[tag] = (node: TSESTree.Node) => {
          const bag = match(node, pattern, chain);
          if (!bag) return;
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
          context.report({
            node,
            messageId: "match",
            data,
            ...(factory
              ? {
                  fix(fixer) {
                    let transformedBag: Record<string, unknown> = bag;
                    for (const withEntry of withEntries) {
                      const withFn = withEntry.args[0] as (bag: Record<string, unknown>) => Record<string, unknown>;
                      const newEntries = withFn(transformedBag);
                      transformedBag = { ...transformedBag, ...newEntries };
                    }
                    const output = factory(transformedBag);
                    const ast = reify(output, sourceCode);
                    // reify returns an ESTree-shaped plain object; recast's
                    // print() expects its own ASTNode type which is
                    // structurally compatible but not identical.
                    const text = print(ast as Parameters<typeof print>[0]).code;

                    // If imports are specified, prepend missing ones to the file
                    if (importMap) {
                      const fullSource = sourceCode?.getText?.() ?? "";
                      const missingImports: Record<string, string> = {};
                      for (const [specifier, modulePath] of Object.entries(importMap)) {
                        // Simple heuristic: check if an import of this specifier from this module exists
                        const importPattern = new RegExp(
                          `import\\s+\\{[^}]*\\b${specifier}\\b[^}]*\\}\\s+from\\s+["']${modulePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`
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
