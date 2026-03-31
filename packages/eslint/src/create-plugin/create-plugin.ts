import { NODE, symGet } from "@ts-unify/core";
import type { ProxyNode, ChainEntry } from "@ts-unify/core";
import type { RuleModule } from "../rule-module";
import type { TransformLike } from "../transform-like";
import { createRule } from "../create-rule";

function isRecommended(transform: TransformLike): boolean {
  const node = symGet(transform, NODE) as ProxyNode | undefined;
  return node?.chain?.some((c: ChainEntry) => c.method === "recommended") ?? false;
}

/** Create an ESLint plugin from a map of rule names to AstTransform values. */
export function createPlugin(
  rules: Record<string, TransformLike>,
  opts: { prefix?: string } = {}
): {
  rules: Record<string, RuleModule>;
  configs: { recommended: { rules: Record<string, string> } };
} {
  const prefix = opts.prefix ?? "ts-unify";
  const ruleModules: Record<string, RuleModule> = {};
  const recommendedRules: Record<string, string> = {};

  for (const [name, transform] of Object.entries(rules)) {
    const qualifiedName = `${prefix}/${name}`;
    ruleModules[qualifiedName] = createRule(transform, {
      message: `ts-unify: ${name}`,
    });
    if (isRecommended(transform)) {
      recommendedRules[qualifiedName] = "warn";
    }
  }

  return {
    rules: ruleModules,
    configs: { recommended: { rules: recommendedRules } },
  };
}
