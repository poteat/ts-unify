import { NODE, match, reify, extractPatterns } from "@ts-unify/core";
import type { ProxyNode } from "@ts-unify/core";
import type { TSESTree } from "@typescript-eslint/types";
import type { RuleModule } from "../rule-module";
import type { TransformLike } from "../transform-like";
import { print } from "recast";

type ChainEntry = { method: string; args: unknown[] };

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
