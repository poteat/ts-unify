import { NODE, match, reify, extractPatterns, CONFIG_BRAND } from "@ts-unify/core";
import type { ProxyNode } from "@ts-unify/core";
import type { TSESTree } from "@typescript-eslint/types";
import type { RuleModule } from "../rule-module";
import type { TransformLike } from "../transform-like";
import { print } from "recast";

type ChainEntry = { method: string; args: unknown[] };

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
      (value as any)[CONFIG_BRAND] === true
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
  const message = opts.message ?? "Matches a ts-unify pattern";

  const proxyNode: ProxyNode | undefined = (transform as any)[NODE];
  const toEntry = proxyNode?.chain?.find(
    (c: ChainEntry) => c.method === "to"
  );
  const factory =
    opts.fix === true && toEntry?.args[0]
      ? (toEntry.args[0] as (bag: Record<string, unknown>) => unknown)
      : null;

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
                    const output = factory(bag);
                    const ast = reify(output, sourceCode);
                    const text = print(ast).code;

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
                        ] as any;
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
