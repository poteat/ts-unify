import { NODE, CAPTURE_BRAND } from "@ts-unify/core";
import type { ProxyNode } from "@ts-unify/core";

/**
 * Compile an AstTransform (or array of them) into an ESLint rule definition.
 */
export function createRule(
  ...transforms: any[]
): { create: (context: any) => Record<string, (node: any) => void> } {
  const visitors: Record<string, ((node: any) => void)[]> = {};

  for (const transform of transforms) {
    const proxyNode: ProxyNode | undefined = transform[NODE];
    if (!proxyNode) continue;

    const { tag, args, chain } = proxyNode;
    const pattern = args[0] ?? {};
    const toEntry = chain.find((c) => c.method === "to");
    const factory = toEntry?.args[0];
    if (!tag || !factory) continue;

    if (!visitors[tag]) visitors[tag] = [];
    visitors[tag].push((node) => {
      const bag = match(node, pattern);
      if (!bag) return;
      // TODO: apply factory, generate fix
    });
  }

  return {
    create(_context) {
      const result: Record<string, (node: any) => void> = {};
      for (const [type, fns] of Object.entries(visitors)) {
        result[type] = (node) => {
          for (const fn of fns) fn(node);
        };
      }
      return result;
    },
  };
}

/**
 * Match an AST node against a pattern object, extracting captures.
 * Returns the capture bag on match, or null on mismatch.
 */
export function match(
  node: any,
  pattern: any
): Record<string, any> | null {
  const bag: Record<string, any> = {};

  for (const [key, expected] of Object.entries(pattern)) {
    const actual = node[key];

    if (isCapture(expected)) {
      bag[expected.name] = actual;
      continue;
    }

    if (isProxyNode(expected)) {
      const inner: ProxyNode = (expected as any)[NODE];
      if (inner.tag === "or") {
        // U.or(a, b, ...) — match if actual equals any arg
        if (!inner.args.some((arg) => matchValue(actual, arg) !== null)) return null;
        continue;
      }
      // Nested builder pattern: U.UnaryExpression({ operator: "!" })
      if (actual?.type !== inner.tag) return null;
      const innerPattern = inner.args[0] ?? {};
      const innerBag = match(actual, innerPattern);
      if (!innerBag) return null;
      Object.assign(bag, innerBag);
      continue;
    }

    if (typeof expected === "object" && expected !== null && !Array.isArray(expected)) {
      // Plain object pattern (not a builder, not a capture)
      const innerBag = match(actual, expected);
      if (!innerBag) return null;
      Object.assign(bag, innerBag);
      continue;
    }

    if (Array.isArray(expected)) {
      if (!Array.isArray(actual)) return null;
      // TODO: handle spread captures in arrays
      if (actual.length !== expected.length) return null;
      for (let i = 0; i < expected.length; i++) {
        const elemBag = matchValue(actual[i], expected[i]);
        if (!elemBag) return null;
        Object.assign(bag, elemBag);
      }
      continue;
    }

    // Literal comparison
    if (actual !== expected) return null;
  }

  return bag;
}

function matchValue(
  actual: any,
  expected: any
): Record<string, any> | null {
  if (isCapture(expected)) {
    return { [expected.name]: actual };
  }
  if (isProxyNode(expected)) {
    const inner: ProxyNode = (expected as any)[NODE];
    if (inner.tag === "or") {
      for (const arg of inner.args) {
        const result = matchValue(actual, arg);
        if (result) return result;
      }
      return null;
    }
    if (actual?.type !== inner.tag) return null;
    return match(actual, inner.args[0] ?? {});
  }
  if (typeof expected === "object" && expected !== null) {
    return match(actual, expected);
  }
  return actual === expected ? {} : null;
}

/** Extract the entry node type and pattern from a rule's proxy trace. */
export function extractPattern(rule: any): {
  tag: string;
  pattern: any;
} | null {
  const proxyNode: ProxyNode | undefined = rule[NODE];
  if (!proxyNode?.tag) return null;
  return { tag: proxyNode.tag, pattern: proxyNode.args[0] ?? {} };
}

function isCapture(v: any): v is { name: string } {
  return v && typeof v === "object" && v[CAPTURE_BRAND] === true;
}

function isProxyNode(v: any): v is ProxyNode {
  return typeof v === "function" && v[NODE] != null;
}
