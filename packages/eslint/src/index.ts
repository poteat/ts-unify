import { NODE, match, reify, extractPatterns } from "@ts-unify/core";
import type { ProxyNode } from "@ts-unify/core";
import type { TSESTree } from "@typescript-eslint/types";
import { print } from "recast";

/** Any value produced by the fluent API that carries a proxy trace. */
type TransformLike = { readonly [k: symbol]: ProxyNode };

type RuleContext = {
  sourceCode?: { getText(node: TSESTree.Node): string };
  getSourceCode?(): { getText(node: TSESTree.Node): string };
  report(descriptor: {
    node: TSESTree.Node;
    messageId: string;
    data?: Record<string, string>;
    fix?: (fixer: RuleFixer) => RuleFix;
  }): void;
};

type RuleFixer = {
  replaceText(node: TSESTree.Node, text: string): RuleFix;
};

type RuleFix = { range: [number, number]; text: string };

type ChainEntry = { method: string; args: unknown[] };

export type RuleModule = {
  meta: {
    type: "suggestion";
    fixable?: "code";
    messages: Record<string, string>;
  };
  create: (
    context: RuleContext
  ) => Record<string, (node: TSESTree.Node) => void>;
};

/**
 * Compile an AstTransform into an ESLint rule module.
 */
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

  return {
    meta: {
      type: "suggestion",
      ...(factory ? { fixable: "code" as const } : {}),
      messages: { match: message },
    },
    create(context: RuleContext) {
      const visitors: Record<string, (node: TSESTree.Node) => void> = {};
      const sourceCode = context.sourceCode ?? context.getSourceCode?.();

      for (const { tag, pattern } of entries) {
        visitors[tag] = (node: TSESTree.Node) => {
          const bag = match(node, pattern);
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
                  fix(fixer: RuleFixer) {
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
  rules: Record<string, TransformLike>,
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
