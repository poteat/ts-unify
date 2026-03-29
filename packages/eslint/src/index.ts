import { NODE, CAPTURE_BRAND, SPREAD_BRAND, $ as dollarSentinel } from "@ts-unify/core";
import type { ProxyNode } from "@ts-unify/core";
import type { TSESTree } from "@typescript-eslint/types";

type RuleModule = {
  meta: { type: "suggestion"; messages: Record<string, string> };
  create: (context: any) => Record<string, (node: TSESTree.Node) => void>;
};

/**
 * Compile an AstTransform into an ESLint rule module.
 */
export function createRule(
  transform: any,
  opts: { message?: string } = {}
): RuleModule {
  const entries = extractPatterns(transform);
  const message = opts.message ?? "Matches a ts-unify pattern";

  return {
    meta: {
      type: "suggestion",
      messages: { match: message },
    },
    create(context) {
      const visitors: Record<string, (node: TSESTree.Node) => void> = {};

      for (const { tag, pattern } of entries) {
        visitors[tag] = (node) => {
          const bag = match(node, pattern);
          if (!bag) return;
          const data: Record<string, string> = {};
          for (const [k, v] of Object.entries(bag)) {
            data[k] = typeof v === "object" && v?.type === "Identifier" ? v.name : String(v);
          }
          context.report({ node, messageId: "match", data });
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

/**
 * Match an AST node against a pattern object, extracting captures.
 * Returns the capture bag on match, or null on mismatch.
 */
export function match(
  node: any,
  pattern: any
): Record<string, any> | null {
  const namedBindings: { name: string; value: any }[] = [];
  const bag = matchInner(node, pattern, namedBindings);
  if (!bag) return null;

  // Validate duplicate named captures have equal values
  const seen: Record<string, any> = {};
  for (const { name, value } of namedBindings) {
    if (name in seen) {
      if (!deepEqual(seen[name], value)) return null;
    } else {
      seen[name] = value;
    }
  }

  return bag;
}

function matchInner(
  node: any,
  pattern: any,
  namedBindings: { name: string; value: any }[]
): Record<string, any> | null {
  const bag: Record<string, any> = {};

  for (const [key, expected] of Object.entries(pattern)) {
    const actual = node[key];

    if (expected === dollarSentinel) {
      bag[key] = actual;
      continue;
    }

    if (isCapture(expected)) {
      bag[expected.name] = actual;
      namedBindings.push({ name: expected.name, value: actual });
      continue;
    }

    if (isProxyNode(expected)) {
      const inner: ProxyNode = (expected as any)[NODE];
      if (inner.tag === "or") {
        const orBag = matchOrInner(actual, inner.args, namedBindings);
        if (!orBag) return null;
        Object.assign(bag, orBag);
        continue;
      }
      if (inner.tag === "maybeBlock") {
        const maybeBlockBag = matchMaybeBlockInner(actual, inner.args[0], namedBindings);
        if (!maybeBlockBag) return null;
        Object.assign(bag, maybeBlockBag);
        continue;
      }
      if (actual?.type !== inner.tag) return null;
      const innerPattern = inner.args[0] ?? {};
      const innerBag = matchInner(actual, innerPattern, namedBindings);
      if (!innerBag) return null;
      Object.assign(bag, innerBag);
      continue;
    }

    if (typeof expected === "object" && expected !== null && !Array.isArray(expected)) {
      const innerBag = matchInner(actual, expected, namedBindings);
      if (!innerBag) return null;
      Object.assign(bag, innerBag);
      continue;
    }

    if (Array.isArray(expected)) {
      if (!Array.isArray(actual)) return null;
      const arrayBag = matchArrayInner(actual, expected, key, namedBindings);
      if (!arrayBag) return null;
      Object.assign(bag, arrayBag);
      continue;
    }

    if (actual !== expected) return null;
  }

  return bag;
}

/** Extract the first entry pattern from a rule's proxy trace. */
export function extractPattern(rule: any): {
  tag: string;
  pattern: any;
} | null {
  const patterns = extractPatterns(rule);
  return patterns[0] ?? null;
}

/** Extract all entry patterns (handles top-level U.or and U.fromNode). */
export function extractPatterns(rule: any): {
  tag: string;
  pattern: any;
}[] {
  const proxyNode: ProxyNode | undefined = rule[NODE];
  if (!proxyNode?.tag) return [];
  if (proxyNode.tag === "or") {
    return proxyNode.args.flatMap((arg: any) => {
      if (typeof arg === "function" && arg[NODE]) {
        const inner: ProxyNode = arg[NODE];
        return [{ tag: inner.tag, pattern: inner.args[0] ?? {} }];
      }
      return [];
    });
  }
  if (proxyNode.tag === "fromNode") {
    const pattern = proxyNode.args[0] ?? {};
    const typeField = pattern.type;
    if (typeof typeField === "function" && typeField[NODE]) {
      const typeNode: ProxyNode = typeField[NODE];
      if (typeNode.tag === "or") {
        const { type: _type, ...rest } = pattern;
        return typeNode.args.map((t: string) => ({ tag: t, pattern: rest }));
      }
    }
    if (typeof typeField === "string") {
      const { type: _type, ...rest } = pattern;
      return [{ tag: typeField, pattern: rest }];
    }
    return [];
  }
  return [{ tag: proxyNode.tag, pattern: proxyNode.args[0] ?? {} }];
}

function matchValueInner(
  actual: any,
  expected: any,
  namedBindings: { name: string; value: any }[],
  key?: string
): Record<string, any> | null {
  if (expected === dollarSentinel) {
    return key ? { [key]: actual } : { _: actual };
  }
  if (isCapture(expected)) {
    namedBindings.push({ name: expected.name, value: actual });
    return { [expected.name]: actual };
  }
  if (isProxyNode(expected)) {
    const inner: ProxyNode = (expected as any)[NODE];
    if (inner.tag === "or") {
      return matchOrInner(actual, inner.args, namedBindings);
    }
    if (inner.tag === "maybeBlock") {
      return matchMaybeBlockInner(actual, inner.args[0], namedBindings);
    }
    if (actual?.type !== inner.tag) return null;
    return matchInner(actual, inner.args[0] ?? {}, namedBindings);
  }
  if (typeof expected === "object" && expected !== null) {
    return matchInner(actual, expected, namedBindings);
  }
  return actual === expected ? {} : null;
}


function isSpread(v: any): v is { name: string } {
  return v && typeof v === "object" && v[SPREAD_BRAND] === true;
}

function matchArrayInner(
  actual: any[],
  expected: any[],
  parentKey: string,
  namedBindings: { name: string; value: any }[]
): Record<string, any> | null {
  const mv = (a: any, e: any, k?: string) => matchValueInner(a, e, namedBindings, k);

  const spreadIndices: number[] = [];
  for (let i = 0; i < expected.length; i++) {
    if (isSpread(expected[i])) spreadIndices.push(i);
  }

  if (spreadIndices.length === 0) {
    if (actual.length !== expected.length) return null;
    const bag: Record<string, any> = {};
    for (let i = 0; i < expected.length; i++) {
      const elemBag = mv(actual[i], expected[i], `${i}`);
      if (!elemBag) return null;
      Object.assign(bag, elemBag);
    }
    return bag;
  }

  if (spreadIndices.length === 1) {
    const si = spreadIndices[0];
    const before = expected.slice(0, si);
    const after = expected.slice(si + 1);
    if (actual.length < before.length + after.length) return null;

    const bag: Record<string, any> = {};
    for (let i = 0; i < before.length; i++) {
      const elemBag = mv(actual[i], before[i], `${i}`);
      if (!elemBag) return null;
      Object.assign(bag, elemBag);
    }
    for (let i = 0; i < after.length; i++) {
      const idx = actual.length - after.length + i;
      const elemBag = mv(actual[idx], after[i], `${idx}`);
      if (!elemBag) return null;
      Object.assign(bag, elemBag);
    }
    const spread = expected[si];
    const name = spread.name || parentKey;
    if (name) bag[name] = actual.slice(before.length, actual.length - after.length);
    return bag;
  }

  if (spreadIndices.length === 2) {
    const [si1, si2] = spreadIndices;
    const before = expected.slice(0, si1);
    const middle = expected.slice(si1 + 1, si2);
    const after = expected.slice(si2 + 1);
    if (actual.length < before.length + middle.length + after.length) return null;

    const bag: Record<string, any> = {};
    for (let i = 0; i < before.length; i++) {
      const elemBag = mv(actual[i], before[i], `${i}`);
      if (!elemBag) return null;
      Object.assign(bag, elemBag);
    }
    for (let i = 0; i < after.length; i++) {
      const idx = actual.length - after.length + i;
      const elemBag = mv(actual[idx], after[i], `${idx}`);
      if (!elemBag) return null;
      Object.assign(bag, elemBag);
    }
    const mStart = before.length;
    const mEnd = actual.length - after.length;
    for (let off = 0; off <= mEnd - mStart - middle.length; off++) {
      const pos = mStart + off;
      const mBag: Record<string, any> = {};
      let ok = true;
      for (let i = 0; i < middle.length; i++) {
        const elemBag = mv(actual[pos + i], middle[i], `${pos + i}`);
        if (!elemBag) { ok = false; break; }
        Object.assign(mBag, elemBag);
      }
      if (ok) {
        Object.assign(bag, mBag);
        const s1 = expected[si1];
        const s2 = expected[si2];
        if (s1.name || parentKey) bag[s1.name || parentKey] = actual.slice(before.length, pos);
        if (s2.name) bag[s2.name] = actual.slice(pos + middle.length, mEnd);
        return bag;
      }
    }
    return null;
  }

  return null;
}


function matchOrInner(actual: any, args: any[], namedBindings: { name: string; value: any }[]): Record<string, any> | null {
  for (const arg of args) {
    const result = matchValueInner(actual, arg, namedBindings);
    if (result) return result;
  }
  return null;
}

function matchMaybeBlockInner(
  actual: any,
  stmtPattern: any,
  namedBindings: { name: string; value: any }[]
): Record<string, any> | null {
  if (actual?.type === "BlockStatement" && Array.isArray(actual.body) && actual.body.length === 1) {
    const result = matchValueInner(actual.body[0], stmtPattern, namedBindings);
    if (result) return result;
  }
  return matchValueInner(actual, stmtPattern, namedBindings);
}

const SKIP_KEYS = new Set(["parent", "loc", "range"]);

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    return a.every((v: any, i: number) => deepEqual(v, b[i]));
  }
  const keysA = Object.keys(a).filter((k) => !SKIP_KEYS.has(k));
  const keysB = Object.keys(b).filter((k) => !SKIP_KEYS.has(k));
  if (keysA.length !== keysB.length) return false;
  return keysA.every((k) => deepEqual(a[k], b[k]));
}

function isCapture(v: any): v is { name: string } {
  return v && typeof v === "object" && v[CAPTURE_BRAND] === true;
}

function isProxyNode(v: any): v is ProxyNode {
  return typeof v === "function" && v[NODE] != null;
}
