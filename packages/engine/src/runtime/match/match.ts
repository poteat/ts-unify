import { NODE, CAPTURE_BRAND, SPREAD_BRAND, $ as dollarSentinel, REST_CAPTURE, CONFIG_BRAND } from "@ts-unify/core/internal";
import type { ProxyNode, ChainEntry } from "@ts-unify/core/internal";
import { symGet } from "../sym-get";

type NamedBinding = { name: string; value: unknown };

/**
 * Match an AST node against a pattern object, extracting captures.
 * Returns the capture bag on match, or null on mismatch.
 */
export function match(
  node: unknown,
  pattern: unknown,
  chain?: ChainEntry[]
): Record<string, unknown> | null {
  const configDefaults = chain ? extractConfigDefaults(chain) : {};
  const namedBindings: NamedBinding[] = [];
  const bag = matchInner(node, pattern, namedBindings, configDefaults);
  if (!bag) return null;

  // Validate duplicate named captures have equal values
  const seen: Record<string, unknown> = {};
  for (const { name, value } of namedBindings) {
    if (name in seen) {
      if (!deepEqual(seen[name], value)) return null;
    } else {
      seen[name] = value;
    }
  }

  // Enforce top-level .when() guards
  if (chain && !applyWhenGuards(chain, bag)) return null;

  // Enforce .where() constraints: quantified pattern searches over scoped
  // subtrees. Currently supports .none() quantifier (subtree scope).
  if (chain && !applyWhere(chain, node)) return null;

  return bag;
}

function matchInner(
  node: unknown,
  pattern: unknown,
  namedBindings: NamedBinding[],
  configDefaults: Record<string, unknown> = {}
): Record<string, unknown> | null {
  // When the entire pattern is $, capture all own non-meta properties of the node
  if (pattern === dollarSentinel) {
    const bag: Record<string, unknown> = {};
    if (node && typeof node === "object") {
      for (const key of Object.keys(node)) {
        if (!SKIP_KEYS.has(key)) bag[key] = (node as Record<string, unknown>)[key];
      }
    }
    return bag;
  }

  const bag: Record<string, unknown> = {};
  const nodeRec = node as Record<string, unknown>;
  const patternRec = pattern as Record<string | symbol, unknown>;

  for (const [key, expected] of Object.entries(patternRec)) {
    const actual = nodeRec[key];

    if (expected === dollarSentinel) {
      bag[key] = actual;
      continue;
    }

    if (isCapture(expected)) {
      bag[expected.name] = actual;
      namedBindings.push({ name: expected.name, value: actual });
      continue;
    }

    // Config slot: match against the config default value for the slot name
    if (isConfigSlot(expected)) {
      const defaultVal = configDefaults[expected.name];
      if (actual !== defaultVal) return null;
      continue;
    }

    if (isProxyNode(expected)) {
      const proxyBag = matchProxyNode(actual, expected, namedBindings, configDefaults, key);
      if (!proxyBag) return null;
      Object.assign(bag, proxyBag);
      continue;
    }

    if (typeof expected === "object" && expected !== null && !Array.isArray(expected)) {
      const innerBag = matchInner(actual, expected, namedBindings, configDefaults);
      if (!innerBag) return null;
      Object.assign(bag, innerBag);
      continue;
    }

    if (Array.isArray(expected)) {
      if (!Array.isArray(actual)) return null;
      const arrayBag = matchArrayInner(actual, expected, key, namedBindings, configDefaults);
      if (!arrayBag) return null;
      Object.assign(bag, arrayBag);
      continue;
    }

    if (actual !== expected) return null;
  }

  // When the pattern was built with `{ ...$ }`, capture all remaining
  // (unmatched) properties of the node into the bag.
  if (patternRec[REST_CAPTURE] && node && typeof node === "object") {
    const patternKeys = new Set(Object.keys(patternRec));
    for (const key of Object.keys(node)) {
      if (!SKIP_KEYS.has(key) && !patternKeys.has(key)) {
        bag[key] = (node as Record<string, unknown>)[key];
      }
    }
  }

  return bag;
}

/**
 * Match a proxy node pattern value against an actual AST value.
 * Handles or, maybeBlock, seal, and bind chain entries.
 * Note: defaultUndefined is a type-level-only modifier -- the bare `$`
 * sentinel already captures null/undefined at runtime.
 */
function matchProxyNode(
  actual: unknown,
  expected: unknown,
  namedBindings: NamedBinding[],
  configDefaults: Record<string, unknown>,
  parentKey?: string
): Record<string, unknown> | null {
  const inner = symGet(expected, NODE) as ProxyNode;

  if (inner.tag === "or") {
    // Pass parentKey to or branches so seal/bind on branches can re-key properly
    const orBag = matchOrInner(actual, inner.args, namedBindings, configDefaults, parentKey);
    if (!orBag) return null;
    if (!applyWhenGuards(inner.chain, orBag)) return null;
    return applyChainModifiers(inner.chain, orBag, actual, parentKey);
  }
  if (inner.tag === "maybeBlock") {
    const maybeBlockBag = matchMaybeBlockInner(actual, inner.args[0], namedBindings, configDefaults);
    if (!maybeBlockBag) return null;
    if (!applyWhenGuards(inner.chain, maybeBlockBag)) return null;
    return applyChainModifiers(inner.chain, maybeBlockBag, actual, parentKey);
  }
  if ((actual as Record<string, unknown> | null | undefined)?.type !== inner.tag) return null;
  const innerPattern = inner.args[0] ?? {};
  const innerBag = matchInner(actual, innerPattern, namedBindings, configDefaults);
  if (!innerBag) return null;
  if (!applyWhenGuards(inner.chain, innerBag)) return null;
  return applyChainModifiers(inner.chain, innerBag, actual, parentKey);
}

function matchValueInner(
  actual: unknown,
  expected: unknown,
  namedBindings: NamedBinding[],
  configDefaults: Record<string, unknown> = {},
  key?: string
): Record<string, unknown> | null {
  if (expected === dollarSentinel) {
    return key ? { [key]: actual } : { _: actual };
  }
  if (isCapture(expected)) {
    namedBindings.push({ name: expected.name, value: actual });
    return { [expected.name]: actual };
  }
  if (isConfigSlot(expected)) {
    const defaultVal = configDefaults[expected.name];
    return actual === defaultVal ? {} : null;
  }
  if (isProxyNode(expected)) {
    return matchProxyNode(actual, expected, namedBindings, configDefaults, key);
  }
  if (typeof expected === "object" && expected !== null) {
    return matchInner(actual, expected, namedBindings, configDefaults);
  }
  return actual === expected ? {} : null;
}

function isSpread(v: unknown): v is { name: string } {
  return v != null && typeof v === "object" && symGet(v, SPREAD_BRAND) === true;
}

function matchArrayInner(
  actual: unknown[],
  expected: unknown[],
  parentKey: string,
  namedBindings: NamedBinding[],
  configDefaults: Record<string, unknown> = {}
): Record<string, unknown> | null {
  const mv = (a: unknown, e: unknown, k?: string) => matchValueInner(a, e, namedBindings, configDefaults, k);

  const spreadIndices: number[] = [];
  for (let i = 0; i < expected.length; i++) {
    if (isSpread(expected[i])) spreadIndices.push(i);
  }

  if (spreadIndices.length === 0) {
    if (actual.length !== expected.length) return null;
    const bag: Record<string, unknown> = {};
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

    const bag: Record<string, unknown> = {};
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
    const spread = expected[si] as { name: string };
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

    const bag: Record<string, unknown> = {};
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
      const mBag: Record<string, unknown> = {};
      let ok = true;
      for (let i = 0; i < middle.length; i++) {
        const elemBag = mv(actual[pos + i], middle[i], `${pos + i}`);
        if (!elemBag) { ok = false; break; }
        Object.assign(mBag, elemBag);
      }
      if (ok) {
        Object.assign(bag, mBag);
        const s1 = expected[si1] as { name: string };
        const s2 = expected[si2] as { name: string };
        if (s1.name || parentKey) bag[s1.name || parentKey] = actual.slice(before.length, pos);
        if (s2.name) bag[s2.name] = actual.slice(pos + middle.length, mEnd);
        return bag;
      }
    }
    return null;
  }

  return null;
}

function matchOrInner(actual: unknown, args: unknown[], namedBindings: NamedBinding[], configDefaults: Record<string, unknown> = {}, parentKey?: string): Record<string, unknown> | null {
  for (const arg of args) {
    const result = matchValueInner(actual, arg, namedBindings, configDefaults, parentKey);
    if (result) return result;
  }
  return null;
}

function matchMaybeBlockInner(
  actual: unknown,
  stmtPattern: unknown,
  namedBindings: NamedBinding[],
  configDefaults: Record<string, unknown> = {}
): Record<string, unknown> | null {
  const actualRec = actual as Record<string, unknown> | null | undefined;
  if (actualRec?.type === "BlockStatement" && Array.isArray(actualRec.body) && actualRec.body.length === 1) {
    const result = matchValueInner((actualRec.body as unknown[])[0], stmtPattern, namedBindings, configDefaults);
    if (result) return result;
  }
  return matchValueInner(actual, stmtPattern, namedBindings, configDefaults);
}

const SKIP_KEYS = new Set(["parent", "loc", "range"]);

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== (b as unknown[]).length) return false;
    return a.every((v: unknown, i: number) => deepEqual(v, (b as unknown[])[i]));
  }
  const aRec = a as Record<string, unknown>;
  const bRec = b as Record<string, unknown>;
  const keysA = Object.keys(aRec).filter((k) => !SKIP_KEYS.has(k));
  const keysB = Object.keys(bRec).filter((k) => !SKIP_KEYS.has(k));
  if (keysA.length !== keysB.length) return false;
  return keysA.every((k) => deepEqual(aRec[k], bRec[k]));
}

/**
 * Check `.when()` guards in a proxy node's chain.
 * Returns true if all guards pass (or there are none), false otherwise.
 */
function applyWhenGuards(
  chain: ChainEntry[],
  bag: Record<string, unknown>
): boolean {
  for (const entry of chain) {
    if (entry.method === "when") {
      const guardFn = entry.args[0];
      if (typeof guardFn === "function" && !guardFn(bag)) return false;
    }
  }
  return true;
}

/**
 * Enforce `.where()` chain entries. Each entry carries one or more
 * constraint patterns. Each pattern's chain carries a quantifier
 * (`.none()`, `.some()`, `.atLeast(N)`, `.atMost(N)`, `.exactly(N)`)
 * and an optional scope modifier (`.until()` for subtree boundaries).
 */
function applyWhere(chain: ChainEntry[], actual: unknown): boolean {
  for (const entry of chain) {
    if (entry.method !== "where") continue;
    for (const constraint of entry.args) {
      if (!isProxyNode(constraint)) continue;
      const cNode = symGet(constraint, NODE) as ProxyNode;

      const untilEntry = chainGet(cNode.chain, "until");
      const boundary = untilEntry?.args[0] ?? null;

      const q = readQuantifier(cNode.chain);
      if (!q) continue;

      // For .none(), short-circuit on first match (optimization).
      if (q.kind === "none") {
        if (subtreeCount(actual, cNode, boundary, 1) > 0) return false;
        continue;
      }

      const count = subtreeCount(actual, cNode, boundary);
      if (!q.test(count)) return false;
    }
  }
  return true;
}

type Quantifier = { kind: string; test: (n: number) => boolean };

function readQuantifier(chain: ChainEntry[]): Quantifier | null {
  if (chainHas(chain, "none")) return { kind: "none", test: (n) => n === 0 };
  if (chainHas(chain, "some")) return { kind: "some", test: (n) => n > 0 };
  const atLeast = chainGet(chain, "atLeast");
  if (atLeast) { const k = (atLeast.args[0] ?? 0) as number; return { kind: "atLeast", test: (n) => n >= k }; }
  const atMost = chainGet(chain, "atMost");
  if (atMost) { const k = (atMost.args[0] ?? 0) as number; return { kind: "atMost", test: (n) => n <= k }; }
  const exactly = chainGet(chain, "exactly");
  if (exactly) { const k = (exactly.args[0] ?? 0) as number; return { kind: "exactly", test: (n) => n === k }; }
  return null;
}

/**
 * Count how many descendants of `root` match the pattern, respecting
 * `.until()` boundaries. The root itself is NOT checked.
 * @param limit Stop counting early once this limit is reached (optimization).
 */
function subtreeCount(
  root: unknown,
  pattern: ProxyNode,
  boundary: unknown,
  limit?: number
): number {
  const rootRec = root as Record<string, unknown> | null | undefined;
  if (!rootRec || typeof rootRec !== "object") return 0;
  let count = 0;

  for (const key of Object.keys(rootRec)) {
    if (SKIP_KEYS.has(key)) continue;
    const child = rootRec[key];
    if (Array.isArray(child)) {
      for (const item of child) {
        count += countDescendant(item, pattern, boundary, limit ? limit - count : undefined);
        if (limit && count >= limit) return count;
      }
    } else if (child && typeof child === "object" && (child as Record<string, unknown>).type) {
      count += countDescendant(child, pattern, boundary, limit ? limit - count : undefined);
      if (limit && count >= limit) return count;
    }
  }
  return count;
}

/**
 * Check a single descendant and recurse. Returns the number of matches
 * found in this node and its subtree.
 */
function countDescendant(
  node: unknown,
  pattern: ProxyNode,
  boundary: unknown,
  limit?: number
): number {
  const nodeRec = node as Record<string, unknown> | null | undefined;
  if (!nodeRec || typeof nodeRec !== "object" || !nodeRec.type) return 0;
  let count = 0;

  // Check if this node matches the pattern. Handle U.or().
  if (pattern.tag === "or") {
    for (const alt of pattern.args) {
      if (!isProxyNode(alt)) continue;
      const inner = symGet(alt, NODE) as ProxyNode;
      if (nodeRec.type === inner.tag) {
        const innerPattern = inner.args[0] ?? {};
        if (matchInner(node, innerPattern as Record<string, unknown>, [], {})) {
          count++;
          break; // One match per node is enough
        }
      }
    }
  } else if (nodeRec.type === pattern.tag) {
    const innerPattern = pattern.args[0] ?? {};
    if (matchInner(node, innerPattern as Record<string, unknown>, [], {})) {
      count++;
    }
  }

  if (limit && count >= limit) return count;

  // If this node is a boundary, don't recurse.
  if (boundary && isBoundaryNode(nodeRec, boundary)) return count;

  // Recurse into children.
  for (const key of Object.keys(nodeRec)) {
    if (SKIP_KEYS.has(key)) continue;
    const child = nodeRec[key];
    if (Array.isArray(child)) {
      for (const item of child) {
        count += countDescendant(item, pattern, boundary, limit ? limit - count : undefined);
        if (limit && count >= limit) return count;
      }
    } else if (child && typeof child === "object" && (child as Record<string, unknown>).type) {
      count += countDescendant(child, pattern, boundary, limit ? limit - count : undefined);
      if (limit && count >= limit) return count;
    }
  }
  return count;
}

/**
 * Check if a node matches a boundary pattern. The boundary can be a
 * proxy node (single type) or an or-proxy (multiple types).
 */
function isBoundaryNode(
  node: Record<string, unknown>,
  boundary: unknown
): boolean {
  if (!isProxyNode(boundary)) return false;
  const bNode = symGet(boundary, NODE) as ProxyNode;
  if (bNode.tag === "or") {
    return bNode.args.some((arg: unknown) => {
      if (typeof arg === "string") return node.type === arg;
      if (isProxyNode(arg)) {
        const inner = symGet(arg, NODE) as ProxyNode;
        return node.type === inner.tag;
      }
      return false;
    });
  }
  return node.type === bNode.tag;
}

function isCapture(v: unknown): v is { name: string } {
  return v != null && typeof v === "object" && symGet(v, CAPTURE_BRAND) === true;
}

function isConfigSlot(v: unknown): v is { name: string } {
  return v != null && typeof v === "object" && symGet(v, CONFIG_BRAND) === true;
}

function isProxyNode(v: unknown): boolean {
  return typeof v === "function" && symGet(v, NODE) != null;
}

function chainHas(chain: ChainEntry[], method: string): boolean {
  return chain.some((e) => e.method === method);
}

function chainGet(chain: ChainEntry[], method: string): ChainEntry | undefined {
  return chain.find((e) => e.method === method);
}

/**
 * Resolve config defaults from a chain. The `.config({ key: value })` entry
 * carries the default values for config slots used in the pattern and output.
 */
function extractConfigDefaults(chain: ChainEntry[]): Record<string, unknown> {
  const configEntry = chainGet(chain, "config");
  return (configEntry?.args[0] ?? {}) as Record<string, unknown>;
}

/**
 * Apply seal/bind post-processing to a capture bag.
 *
 * - `seal`: collapse all inner captures into one, re-keyed to `parentKey`
 * - `bind("name")`: replace all captures with `{ name: actual }`
 * - `bind()` (zero-arg): per `node-with-bind.spec.md`, this is "bind under
 *   the canonical name `node` + Sealed". The seal half is what makes the
 *   bag re-key to the embedding property key when placed under a field;
 *   at the root (no `parentKey`) seal is a no-op so the bag stays
 *   `{ node: actual }`. We collapse both halves into a single key
 *   resolution: `parentKey` if embedded, else `"node"`.
 */
function applyChainModifiers(
  chain: ChainEntry[],
  bag: Record<string, unknown>,
  actual: unknown,
  parentKey?: string
): Record<string, unknown> {
  const bindEntry = chainGet(chain, "bind");
  if (bindEntry) {
    const explicitName = bindEntry.args[0] as string | undefined;
    const name = explicitName ?? parentKey ?? "node";
    return { [name]: actual };
  }
  if (chainHas(chain, "seal") && parentKey) {
    const keys = Object.keys(bag);
    if (keys.length === 1) {
      return { [parentKey]: bag[keys[0]] };
    }
    if (keys.length === 0) {
      return {};
    }
    // Multiple captures: just pass them through (type system should prevent this)
    return bag;
  }
  return bag;
}
