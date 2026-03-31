import { NODE, match, reify, extractPatterns, _extractPattern } from "@ts-unify/core";
import type { ProxyNode } from "@ts-unify/core";
import type { TSESTree } from "@typescript-eslint/types";
import { print } from "recast";

// Re-export engine-agnostic runtime functions so existing consumers
// (e.g. e2e tests) that import from @ts-unify/eslint continue to work.
export { match, reify, extractPatterns };
export { _extractPattern as extractPattern };

type RuleModule = {
  meta: { type: "suggestion"; fixable?: "code"; messages: Record<string, string> };
  create: (context: any) => Record<string, (node: TSESTree.Node) => void>;
};

/**
 * Compile an AstTransform into an ESLint rule module.
 */
export function createRule(
  transform: any,
  opts: { message?: string; fix?: boolean } = {}
): RuleModule {
  const entries = extractPatterns(transform);
  const message = opts.message ?? "Matches a ts-unify pattern";

  // Extract the .to() factory from the chain
  const proxyNode: ProxyNode | undefined = transform[NODE];
  const toEntry = proxyNode?.chain?.find((c: any) => c.method === "to");
  const factory = opts.fix === true && toEntry?.args[0] ? toEntry.args[0] : null;

  return {
    meta: {
      type: "suggestion",
      ...(factory ? { fixable: "code" as const } : {}),
      messages: { match: message },
    },
    create(context) {
      const visitors: Record<string, (node: TSESTree.Node) => void> = {};
      const sourceCode = context.sourceCode ?? context.getSourceCode();

      for (const { tag, pattern } of entries) {
        visitors[tag] = (node) => {
          const bag = match(node, pattern);
          if (!bag) return;
          const data: Record<string, string> = {};
          for (const [k, v] of Object.entries(bag)) {
            data[k] = typeof v === "object" && v?.type === "Identifier" ? v.name : String(v);
          }
          context.report({
            node,
            messageId: "match",
            data,
            ...(factory
              ? {
                  fix(fixer: any) {
                    const output = factory(bag);
                    const ast = reify(output, sourceCode);
                    const text = print(ast).code;
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

/**
 * Create an ESLint plugin from a map of rule names to AstTransform values.
 */
export function createPlugin(
  rules: Record<string, any>,
  opts: { prefix?: string } = {}
): { rules: Record<string, RuleModule> } {
  const prefix = opts.prefix ?? "ts-unify";
  const ruleModules: Record<string, RuleModule> = {};

  for (const [name, transform] of Object.entries(rules)) {
    ruleModules[`${prefix}/${name}`] = createRule(transform, {
      message: `ts-unify: ${name}`,
    });
  }

  return { rules: ruleModules };
}
