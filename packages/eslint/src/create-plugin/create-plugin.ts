import type { ProxyNode } from "@ts-unify/core";
import type { RuleModule } from "../rule-module";
import { createRule } from "../create-rule";

type TransformLike = { readonly [k: symbol]: ProxyNode };

/** Create an ESLint plugin from a map of rule names to AstTransform values. */
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
