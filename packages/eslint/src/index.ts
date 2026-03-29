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
          context.report({ node, messageId: "match" });
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
  const bag: Record<string, any> = {};

  for (const [key, expected] of Object.entries(pattern)) {
    const actual = node[key];

    if (expected === dollarSentinel) {
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
        const orBag = matchOr(actual, inner.args);
        if (!orBag) return null;
        Object.assign(bag, orBag);
        continue;
      }
      if (inner.tag === "maybeBlock") {
        const maybeBlockBag = matchMaybeBlock(actual, inner.args[0]);
        if (!maybeBlockBag) return null;
        Object.assign(bag, maybeBlockBag);
        continue;
      }
      if (actual?.type !== inner.tag) return null;
      const innerPattern = inner.args[0] ?? {};
      const innerBag = match(actual, innerPattern);
      if (!innerBag) return null;
      Object.assign(bag, innerBag);
      continue;
    }

    if (typeof expected === "object" && expected !== null && !Array.isArray(expected)) {
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

function isSpread(v: any): v is { name: string } {
  return v && typeof v === "object" && v[SPREAD_BRAND] === true;
}

function matchArray(
  actual: any[],
  expected: any[],
  parentKey: string
): Record<string, any> | null {
  const spreadIndices: number[] = [];
  for (let i = 0; i < expected.length; i++) {
    if (isSpread(expected[i])) spreadIndices.push(i);
  }

  if (spreadIndices.length === 0) {
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

    for (let i = 0; i < before.length; i++) {
      const elemBag = matchValue(actual[i], before[i], `${i}`);
      if (!elemBag) return null;
      Object.assign(bag, elemBag);
    }

    for (let i = 0; i < after.length; i++) {
      const actualIdx = actual.length - after.length + i;
      const elemBag = matchValue(actual[actualIdx], after[i], `${actualIdx}`);
      if (!elemBag) return null;
      Object.assign(bag, elemBag);
    }

    const spread = expected[si];
    const spreadName = spread.name || parentKey;
    if (spreadName) {
      bag[spreadName] = actual.slice(before.length, actual.length - after.length);
    }

    return bag;
  }

  if (spreadIndices.length === 2) {
    const [si1, si2] = spreadIndices;
    const before = expected.slice(0, si1);
    const middle = expected.slice(si1 + 1, si2);
    const after = expected.slice(si2 + 1);
    const fixedLen = before.length + middle.length + after.length;
    if (actual.length < fixedLen) return null;

    const bag: Record<string, any> = {};

    for (let i = 0; i < before.length; i++) {
      const elemBag = matchValue(actual[i], before[i], `${i}`);
      if (!elemBag) return null;
      Object.assign(bag, elemBag);
    }

    for (let i = 0; i < after.length; i++) {
      const actualIdx = actual.length - after.length + i;
      const elemBag = matchValue(actual[actualIdx], after[i], `${actualIdx}`);
      if (!elemBag) return null;
      Object.assign(bag, elemBag);
    }

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
  if (actual?.type === "BlockStatement" && Array.isArray(actual.body) && actual.body.length === 1) {
    const result = matchValue(actual.body[0], stmtPattern);
    if (result) return result;
  }
  return matchValue(actual, stmtPattern);
}

function isCapture(v: any): v is { name: string } {
  return v && typeof v === "object" && v[CAPTURE_BRAND] === true;
}

function isProxyNode(v: any): v is ProxyNode {
  return typeof v === "function" && v[NODE] != null;
}
