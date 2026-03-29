import { NODE, CAPTURE_BRAND, SPREAD_BRAND, $ as dollarSentinel } from "@ts-unify/core";
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

    if (expected === dollarSentinel) {
      // Bare $ — capture using the property key as the name
      bag[key] = actual;
      continue;
    }

    if (isCapture(expected)) {
      bag[expected.name] = actual;
      continue;
    }

    if (isProxyNode(expected)) {
      const inner: ProxyNode = (expected as any)[NODE];
      if (inner.tag === "or") {
        // U.or(a, b, ...) — match if actual equals any arg
        const orBag = matchOr(actual, inner.args);
        if (!orBag) return null;
        Object.assign(bag, orBag);
        continue;
      }
      if (inner.tag === "maybeBlock") {
        // U.maybeBlock(stmt) — match BlockStatement { body: [stmt] } or bare stmt
        const stmtPattern = inner.args[0];
        const maybeBlockBag = matchMaybeBlock(actual, stmtPattern);
        if (!maybeBlockBag) return null;
        Object.assign(bag, maybeBlockBag);
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
      const arrayBag = matchArray(actual, expected, key);
      if (!arrayBag) return null;
      Object.assign(bag, arrayBag);
      continue;
    }

    // Literal comparison
    if (actual !== expected) return null;
  }

  return bag;
}

function matchValue(
  actual: any,
  expected: any,
  key?: string
): Record<string, any> | null {
  if (expected === dollarSentinel) {
    return key ? { [key]: actual } : { _: actual };
  }
  if (isCapture(expected)) {
    return { [expected.name]: actual };
  }
  if (isProxyNode(expected)) {
    const inner: ProxyNode = (expected as any)[NODE];
    if (inner.tag === "or") {
      return matchOr(actual, inner.args);
    }
    if (inner.tag === "maybeBlock") {
      return matchMaybeBlock(actual, inner.args[0]);
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

function isSpread(v: any): v is { name: string } {
  return v && typeof v === "object" && v[SPREAD_BRAND] === true;
}

function matchArray(
  actual: any[],
  expected: any[],
  parentKey: string
): Record<string, any> | null {
  // Find spread positions
  const spreadIndices: number[] = [];
  for (let i = 0; i < expected.length; i++) {
    if (isSpread(expected[i])) spreadIndices.push(i);
  }

  if (spreadIndices.length === 0) {
    // No spreads — exact length match
    if (actual.length !== expected.length) return null;
    const bag: Record<string, any> = {};
    for (let i = 0; i < expected.length; i++) {
      const elemBag = matchValue(actual[i], expected[i], `${i}`);
      if (!elemBag) return null;
      Object.assign(bag, elemBag);
    }
    return bag;
  }

  if (spreadIndices.length === 1) {
    const si = spreadIndices[0];
    const before = expected.slice(0, si);
    const after = expected.slice(si + 1);
    const minLen = before.length + after.length;
    if (actual.length < minLen) return null;

    const bag: Record<string, any> = {};

    // Match fixed elements before the spread
    for (let i = 0; i < before.length; i++) {
      const elemBag = matchValue(actual[i], before[i], `${i}`);
      if (!elemBag) return null;
      Object.assign(bag, elemBag);
    }

    // Match fixed elements after the spread (from the end)
    for (let i = 0; i < after.length; i++) {
      const actualIdx = actual.length - after.length + i;
      const elemBag = matchValue(actual[actualIdx], after[i], `${actualIdx}`);
      if (!elemBag) return null;
      Object.assign(bag, elemBag);
    }

    // Capture the spread slice
    const spread = expected[si];
    const spreadName = spread.name || parentKey;
    if (spreadName) {
      bag[spreadName] = actual.slice(before.length, actual.length - after.length);
    }

    return bag;
  }

  // Multiple spreads — match greedily: first spread takes as much as possible
  // leaving minimum for subsequent fixed+spread segments.
  // For now, only support two spreads (before + after pattern)
  if (spreadIndices.length === 2) {
    const [si1, si2] = spreadIndices;
    const before = expected.slice(0, si1);
    const middle = expected.slice(si1 + 1, si2);
    const after = expected.slice(si2 + 1);
    const fixedLen = before.length + middle.length + after.length;
    if (actual.length < fixedLen) return null;

    const bag: Record<string, any> = {};

    // Match before
    for (let i = 0; i < before.length; i++) {
      const elemBag = matchValue(actual[i], before[i], `${i}`);
      if (!elemBag) return null;
      Object.assign(bag, elemBag);
    }

    // Match after (from end)
    for (let i = 0; i < after.length; i++) {
      const actualIdx = actual.length - after.length + i;
      const elemBag = matchValue(actual[actualIdx], after[i], `${actualIdx}`);
      if (!elemBag) return null;
      Object.assign(bag, elemBag);
    }

    // Try to match middle fixed elements at each possible position
    const middleStart = before.length;
    const middleEnd = actual.length - after.length;
    const range = middleEnd - middleStart;

    for (let offset = 0; offset <= range - middle.length; offset++) {
      const pos = middleStart + offset;
      let middleBag: Record<string, any> | null = {};
      let ok = true;
      for (let i = 0; i < middle.length; i++) {
        const elemBag = matchValue(actual[pos + i], middle[i], `${pos + i}`);
        if (!elemBag) { ok = false; break; }
        Object.assign(middleBag, elemBag);
      }
      if (ok && middleBag) {
        Object.assign(bag, middleBag);
        const s1 = expected[si1];
        const s2 = expected[si2];
        if (s1.name || parentKey) bag[s1.name || parentKey] = actual.slice(before.length, pos);
        if (s2.name) bag[s2.name] = actual.slice(pos + middle.length, middleEnd);
        return bag;
      }
    }
    return null;
  }

  // 3+ spreads not supported
  return null;
}

function matchOr(actual: any, args: any[]): Record<string, any> | null {
  for (const arg of args) {
    const result = matchValue(actual, arg);
    if (result) return result;
  }
  return null;
}

function matchMaybeBlock(
  actual: any,
  stmtPattern: any
): Record<string, any> | null {
  // Try as BlockStatement { body: [stmt] }
  if (actual?.type === "BlockStatement" && Array.isArray(actual.body) && actual.body.length === 1) {
    const result = matchValue(actual.body[0], stmtPattern);
    if (result) return result;
  }
  // Try as bare statement
  return matchValue(actual, stmtPattern);
}

function isCapture(v: any): v is { name: string } {
  return v && typeof v === "object" && v[CAPTURE_BRAND] === true;
}

function isProxyNode(v: any): v is ProxyNode {
  return typeof v === "function" && v[NODE] != null;
}
