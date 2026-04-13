import { NODE } from "@ts-unify/core/internal";
import type { ProxyNode, ChainEntry } from "@ts-unify/core/internal";
import { extractPatterns, symGet } from "@ts-unify/engine";

export type Bag = Record<string, unknown>;
export type Factory = (bag: Bag) => unknown;
export type WithFn = (bag: Bag) => Bag;

export type RuleMeta = {
  kebab: string;
  message: string;
  patterns: ReturnType<typeof extractPatterns>;
  factory: Factory | null;
  withs: WithFn[];
  recommended: boolean;
};

/**
 * Extract runtime metadata from a rule transform's proxy chain.
 * Shared by the ESLint plugin, the playground, and any future CLI.
 */
export function extractRuleMeta(
  exportName: string,
  transform: unknown
): RuleMeta {
  const kebab = exportName
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();
  const patterns = extractPatterns(transform);
  const node = symGet(transform, NODE) as ProxyNode | undefined;

  const msgEntry = node?.chain?.find(
    (c: ChainEntry) => c.method === "message"
  );
  const message = (msgEntry?.args[0] as string | undefined) ?? kebab;

  const toEntry = node?.chain?.find(
    (c: ChainEntry) => c.method === "to"
  );
  // Per node-with-to.spec.md: zero-arg .to() means "output is the
  // single capture value". Synthesize an identity factory for it.
  let factory: Factory | null = null;
  if (toEntry) {
    factory = toEntry.args[0]
      ? (toEntry.args[0] as Factory)
      : (bag: Bag) => Object.values(bag)[0];
  }

  const withs: WithFn[] = [];
  if (factory && node?.chain) {
    for (const entry of node.chain) {
      if (entry.method === "to") break;
      if (entry.method === "with") withs.push(entry.args[0] as WithFn);
    }
  }

  const recommended =
    node?.chain?.some((c: ChainEntry) => c.method === "recommended") ?? false;

  return { kebab, message, patterns, factory, withs, recommended };
}
