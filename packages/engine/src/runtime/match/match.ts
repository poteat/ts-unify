import {
  NODE,
  CAPTURE_BRAND,
  SPREAD_BRAND,
  $,
  REST_CAPTURE,
  CONFIG_BRAND,
  isStringPredicate,
  testString,
} from '@ts-unify/core/internal'
import type { ProxyNode, ChainEntry } from '@ts-unify/core/internal'

import CommentNodes from '../comment-nodes'
import SymGet from '../sym-get'

type NamedBinding = { name: string; value: unknown }

/**
 * Path of property keys / array indices from the root of a matched node down
 * to a sub-position. Used by inner-`.to()` rewrites and capture rebinding.
 */
export type Path = ReadonlyArray<string | number>

/**
 * One inner-`.to()` rewrite to be applied bottom-up after match. `path` is
 * the position within the matched node where the inner pattern lived.
 * `span` is set for seq sites that consumed more than one array element.
 */
export type RewriteSite = {
  path: Path
  factory: (bag: Record<string, unknown>) => unknown
  scopeBag: Record<string, unknown>
  span?: number
}

/**
 * Match result that includes inner-rewrite metadata. The `bag` is the
 * merged capture bag; `sites` enumerates every `.to()` proxy that fired
 * during the match (including any root-level `.to()` from `chain`);
 * `capturePaths` records where each named capture was sourced from, so
 * deeper rewrites can rebind outer-visible captures.
 */
export type MatchResult = {
  bag: Record<string, unknown>
  sites: RewriteSite[]
  capturePaths: Record<string, Path>
}

type Ctx = {
  sites: RewriteSite[]
  capturePaths: Record<string, Path>

  /**
   * The `Program` being matched, when known; raw comments under it get their
   * node view.
   */
  program?: unknown
}

/**
 * Match an AST node against a pattern object, extracting captures.
 * Returns the capture bag on match, or null on mismatch. The pattern may
 * be a fields record or a root proxy such as `U.Identifier({ name: $ })`.
 *
 * For inner-`.to()` rewrite sites, use {@link matchWithSites} instead.
 */
export function match(
  node: unknown,
  pattern: unknown,
  chain?: ChainEntry[],
): Record<string, unknown> | null {
  const result = matchWithSites(node, pattern, chain)

  return result?.bag ?? null
}

/**
 * Match an AST node against a pattern and return the capture bag plus
 * any inner-`.to()` rewrite sites. The root-level chain's `.to()` (if
 * present) is included as a site at path `[]`.
 */
export function matchWithSites(
  node: unknown,
  pattern: unknown,
  chain?: ChainEntry[],
): MatchResult | null {
  const configDefaults = chain ? extractConfigDefaults(chain) : {}
  const namedBindings: NamedBinding[] = []
  const ctx: Ctx = { sites: [], capturePaths: {} }
  if ((node as { type?: unknown } | null)?.type === 'Program')
    ctx.program = node
  // A root proxy (`U.X(...)`) carries its tag and chain itself: match it as
  // a nested proxy would be, so the tag is checked and its guards apply.
  const bag = isProxyNode(pattern)
    ? matchProxyNode(
        node,
        pattern,
        namedBindings,
        configDefaults,
        undefined,
        ctx,
        [],
      )
    : matchInner(node, pattern, namedBindings, configDefaults, ctx, [])
  if (!bag) return null

  // Validate duplicate named captures have equal values
  const seen: Record<string, unknown> = {}

  for (const { name, value } of namedBindings) {
    if (name in seen) {
      if (!deepEqual(seen[name], value)) return null
    } else {
      seen[name] = value
    }
  }

  // Enforce top-level .when() guards
  if (chain && !applyWhenGuards(chain, bag)) return null

  // Enforce .where() constraints: quantified pattern searches over scoped
  // subtrees. Currently supports .none() quantifier (subtree scope).
  if (chain && !applyWhere(chain, node)) return null

  // Pin every site's scopeBag to the final root bag so factories see all
  // merged captures (including any siblings that bound outside their scope).
  // Captures get rebound in place during applyRewrites so this same bag
  // object reflects deeper rewrites by the time outer factories read it.
  for (const site of ctx.sites) site.scopeBag = bag

  // Record root-level .to() as a site at path [] so the rewrite pipeline
  // is uniform (no special "top-level factory" branch downstream).
  if (chain) {
    const toEntry = chainGet(chain, 'to')

    if (toEntry) {
      const factory =
        (toEntry.args[0] as
          | ((bag: Record<string, unknown>) => unknown)
          | undefined) ?? ((b: Record<string, unknown>) => Object.values(b)[0])
      ctx.sites.push({ path: [], factory, scopeBag: bag })
    }
  }

  return { bag, sites: ctx.sites, capturePaths: ctx.capturePaths }
}

function matchInner(
  node: unknown,
  pattern: unknown,
  namedBindings: NamedBinding[],
  configDefaults: Record<string, unknown> = {},
  ctx?: Ctx,
  path: Path = [],
): Record<string, unknown> | null {
  // When the entire pattern is $, capture all own non-meta properties of the node
  if (pattern === $) {
    const bag: Record<string, unknown> = {}

    if (node && typeof node === 'object') {
      for (const key of Object.keys(node)) {
        if (!SKIP_KEYS.has(key)) {
          bag[key] = (node as Record<string, unknown>)[key]
          if (ctx) ctx.capturePaths[key] = [...path, key]
        }
      }
    }

    return bag
  }

  // An object pattern against a slot holding null or a primitive (a Literal's
  // `value: null`, an absent child): nothing to read keys off, no match.
  if (node === null || typeof node !== 'object') return null

  const bag: Record<string, unknown> = {}
  const nodeRec = node as Record<string, unknown>
  const patternRec = pattern as Record<string | symbol, unknown>

  for (const [key, expected] of Object.entries(patternRec)) {
    const actual = nodeRec[key]
    const childPath: Path = [...path, key]

    if (expected === $) {
      bag[key] = actual
      if (ctx) ctx.capturePaths[key] = childPath
      continue
    }

    if (isCapture(expected)) {
      bag[expected.name] = actual
      namedBindings.push({ name: expected.name, value: actual })
      if (ctx) ctx.capturePaths[expected.name] = childPath
      continue
    }

    // Config slot: match against the config default value for the slot name
    if (isConfigSlot(expected)) {
      if (actual !== configDefaults[expected.name]) return null

      continue
    }

    if (isStringPredicate(expected)) {
      if (!testString(expected, actual)) return null
      continue
    }

    if (isProxyNode(expected)) {
      const proxyBag = matchProxyNode(
        actual,
        expected,
        namedBindings,
        configDefaults,
        key,
        ctx,
        childPath,
      )
      if (!proxyBag) return null
      Object.assign(bag, proxyBag)
      continue
    }

    if (typeof expected === 'object' && expected && !Array.isArray(expected)) {
      const innerBag = matchInner(
        actual,
        expected,
        namedBindings,
        configDefaults,
        ctx,
        childPath,
      )
      if (!innerBag) return null
      Object.assign(bag, innerBag)
      continue
    }

    if (Array.isArray(expected)) {
      if (!Array.isArray(actual)) return null
      const arrayBag = matchArrayInner(
        actual,
        expected,
        key,
        namedBindings,
        configDefaults,
        ctx,
        childPath,
      )
      if (!arrayBag) return null
      Object.assign(bag, arrayBag)
      continue
    }

    if (actual !== expected) return null
  }

  // When the pattern was built with `{ ...$ }`, capture all remaining
  // (unmatched) properties of the node into the bag.
  if (patternRec[REST_CAPTURE] && node && typeof node === 'object') {
    const patternKeys = new Set(Object.keys(patternRec))

    for (const key of Object.keys(node)) {
      if (!SKIP_KEYS.has(key) && !patternKeys.has(key)) {
        bag[key] = (node as Record<string, unknown>)[key]
        if (ctx) ctx.capturePaths[key] = [...path, key]
      }
    }
  }

  return bag
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
  parentKey?: string,
  ctx?: Ctx,
  path: Path = [],
): Record<string, unknown> | null {
  const inner = SymGet.symGet(expected, NODE) as ProxyNode

  let resultBag: Record<string, unknown> | null

  if (inner.tag === 'or') {
    // Pass parentKey to or branches so seal/bind on branches can re-key properly
    const orBag = matchOrInner(
      actual,
      inner.args,
      namedBindings,
      configDefaults,
      parentKey,
      ctx,
      path,
    )
    if (!orBag) return null
    if (!applyWhenGuards(inner.chain, orBag)) return null
    resultBag = applyChainModifiers(inner.chain, orBag, actual, parentKey)
  } else if (inner.tag === 'maybeBlock') {
    const maybeBlockBag = matchMaybeBlockInner(
      actual,
      inner.args[0],
      namedBindings,
      configDefaults,
      ctx,
      path,
    )
    if (!maybeBlockBag) return null
    if (!applyWhenGuards(inner.chain, maybeBlockBag)) return null
    resultBag = applyChainModifiers(
      inner.chain,
      maybeBlockBag,
      actual,
      parentKey,
    )
  } else {
    if (inner.tag === 'Comment' && isRawComment(actual)) {
      actual = ctx?.program
        ? CommentNodes.commentNodeOf(ctx.program, actual)
        : undefined

      if (!actual) return null
    }

    if (
      (actual as Record<string, unknown> | null | undefined)?.type !== inner.tag
    )
      return null

    const innerBag = matchInner(
      actual,
      inner.args[0] ?? {},
      namedBindings,
      configDefaults,
      ctx,
      path,
    )

    if (!innerBag) return null

    if (!applyWhenGuards(inner.chain, innerBag)) return null

    resultBag = applyChainModifiers(inner.chain, innerBag, actual, parentKey)
  }

  // Record an inner-`.to()` site if this proxy's chain carries one.
  // scopeBag is filled in at the root of matchWithSites once the merged
  // bag is finalized (so factories see all captures, not just local).
  if (ctx && resultBag) {
    const toEntry = chainGet(inner.chain, 'to')

    if (toEntry) {
      const factory =
        (toEntry.args[0] as
          | ((bag: Record<string, unknown>) => unknown)
          | undefined) ?? ((b: Record<string, unknown>) => Object.values(b)[0])
      ctx.sites.push({ path, factory, scopeBag: resultBag })
    }
  }

  return resultBag
}

function matchValueInner(
  actual: unknown,
  expected: unknown,
  namedBindings: NamedBinding[],
  configDefaults: Record<string, unknown> = {},
  key?: string,
  ctx?: Ctx,
  path: Path = [],
): Record<string, unknown> | null {
  if (expected === $) {
    if (ctx && key) ctx.capturePaths[key] = path

    return key
      ? {
          [key]: actual,
        }
      : {
          _: actual,
        }
  }

  if (isCapture(expected)) {
    namedBindings.push({
      name: expected.name,
      value: actual,
    })

    if (ctx) ctx.capturePaths[expected.name] = path

    return {
      [expected.name]: actual,
    }
  }

  return isConfigSlot(expected)
    ? actual === configDefaults[expected.name]
      ? {}
      : null
    : isStringPredicate(expected)
      ? testString(expected, actual)
        ? {}
        : null
      : isProxyNode(expected)
        ? matchProxyNode(
            actual,
            expected,
            namedBindings,
            configDefaults,
            key,
            ctx,
            path,
          )
        : typeof expected === 'object' && expected
          ? matchInner(
              actual,
              expected,
              namedBindings,
              configDefaults,
              ctx,
              path,
            )
          : actual === expected
            ? {}
            : null
}

const isSpread = (
  v: unknown,
): v is {
  name: string
} =>
  v != null && typeof v === 'object' && SymGet.symGet(v, SPREAD_BRAND) === true

type SeqInfo = {
  /**
   * Index range in the expanded array that this seq occupies.
   */
  start: number

  length: number

  /**
   * The seq proxy's chain (may contain .to()).
   */
  chain: ChainEntry[]
}

/**
 * Expand seq proxies in an expected array pattern into their constituent
 * elements, tracking seq boundaries for inline rewrites.
 */
function expandSeqs(expected: unknown[]): {
  expanded: unknown[]
  seqs: SeqInfo[]
} {
  const expanded: unknown[] = []
  const seqs: SeqInfo[] = []

  for (const elem of expected) {
    if (isProxyNode(elem)) {
      const pn = SymGet.symGet(elem, NODE) as ProxyNode

      if (pn.tag === 'seq') {
        const start = expanded.length

        for (const arg of pn.args) expanded.push(arg)

        seqs.push({ start, length: pn.args.length, chain: pn.chain })
        continue
      }
    }

    expanded.push(elem)
  }

  return { expanded, seqs }
}

function matchArrayInner(
  actual: unknown[],
  expected: unknown[],
  parentKey: string,
  namedBindings: NamedBinding[],
  configDefaults: Record<string, unknown> = {},
  ctx?: Ctx,
  path: Path = [],
): Record<string, unknown> | null {
  // Expand any U.seq() proxies into their constituents before matching.
  const { expanded, seqs } = expandSeqs(expected)

  if (seqs.length > 0) {
    expected = expanded
  }

  const mv = (a: unknown, e: unknown, k?: string, p?: Path) =>
    matchValueInner(a, e, namedBindings, configDefaults, k, ctx, p)

  const spreadIndices: number[] = []

  for (let i = 0; i < expected.length; i++) {
    if (isSpread(expected[i])) spreadIndices.push(i)
  }

  if (spreadIndices.length === 0) {
    if (actual.length !== expected.length) return null
    const bag: Record<string, unknown> = {}

    for (let i = 0; i < expected.length; i++) {
      const elemBag = mv(actual[i], expected[i], `${i}`, [...path, i])
      if (!elemBag) return null
      Object.assign(bag, elemBag)
    }
    // No-spread: actual index = expanded index for every seq.
    if (ctx)
      for (const seq of seqs) recordSeqSiteAt(seq, bag, ctx, path, seq.start)

    return bag
  }

  if (spreadIndices.length === 1) {
    const si = spreadIndices[0]
    const before = expected.slice(0, si)
    const after = expected.slice(si + 1)

    if (actual.length < before.length + after.length) return null

    const bag: Record<string, unknown> = {}

    for (let i = 0; i < before.length; i++) {
      const elemBag = mv(actual[i], before[i], `${i}`, [...path, i])

      if (!elemBag) return null

      Object.assign(bag, elemBag)
    }

    for (let i = 0; i < after.length; i++) {
      const idx = actual.length - after.length + i
      const elemBag = mv(actual[idx], after[i], `${idx}`, [...path, idx])

      if (!elemBag) return null

      Object.assign(bag, elemBag)
    }

    const name =
      (
        expected[si] as {
          name: string
        }
      ).name || parentKey

    if (name) {
      bag[name] = actual.slice(before.length, actual.length - after.length)

      if (ctx) ctx.capturePaths[name] = path
    }

    return bag
  }

  if (spreadIndices.length === 2) {
    const [si1, si2] = spreadIndices
    const before = expected.slice(0, si1)
    const middle = expected.slice(si1 + 1, si2)
    const after = expected.slice(si2 + 1)
    if (actual.length < before.length + middle.length + after.length)
      return null

    const bag: Record<string, unknown> = {}

    for (let i = 0; i < before.length; i++) {
      const elemBag = mv(actual[i], before[i], `${i}`, [...path, i])
      if (!elemBag) return null
      Object.assign(bag, elemBag)
    }

    for (let i = 0; i < after.length; i++) {
      const idx = actual.length - after.length + i
      const elemBag = mv(actual[idx], after[i], `${idx}`, [...path, idx])
      if (!elemBag) return null
      Object.assign(bag, elemBag)
    }

    const mStart = before.length
    const mEnd = actual.length - after.length

    for (let off = 0; off <= mEnd - mStart - middle.length; off++) {
      const pos = mStart + off
      const mBag: Record<string, unknown> = {}
      let ok = true

      for (let i = 0; i < middle.length; i++) {
        const elemBag = mv(actual[pos + i], middle[i], `${pos + i}`, [
          ...path,
          pos + i,
        ])

        if (!elemBag) {
          ok = false
          break
        }

        Object.assign(mBag, elemBag)
      }

      if (ok) {
        Object.assign(bag, mBag)
        const s1 = expected[si1] as { name: string }
        const s2 = expected[si2] as { name: string }

        if (s1.name || parentKey) {
          const n = s1.name || parentKey
          bag[n] = actual.slice(before.length, pos)
          if (ctx && n) ctx.capturePaths[n] = path
        }

        if (s2.name) {
          bag[s2.name] = actual.slice(pos + middle.length, mEnd)
          if (ctx) ctx.capturePaths[s2.name] = path
        }
        // Two-spread: seqs only meaningful inside `middle`. Their actual
        // start index = pos + (seq.start - si1 - 1).
        if (ctx) {
          for (const seq of seqs) {
            const offsetInMiddle = seq.start - si1 - 1
            if (offsetInMiddle < 0 || offsetInMiddle >= middle.length) continue
            recordSeqSiteAt(seq, bag, ctx, path, pos + offsetInMiddle)
          }
        }

        return bag
      }
    }

    return null
  }

  return null
}

/**
 * Push a seq's `.to()` factory as a rewrite site at the given actual-array
 * index. No-op if the seq has no `.to()` in its chain.
 */
function recordSeqSiteAt(
  seq: SeqInfo,
  bag: Record<string, unknown>,
  ctx: Ctx,
  parentPath: Path,
  actualStart: number,
) {
  const toEntry = seq.chain.find((c: ChainEntry) => c.method === 'to')
  if (!toEntry?.args[0]) return
  const factory = toEntry.args[0] as (bag: Record<string, unknown>) => unknown
  ctx.sites.push({
    path: [...parentPath, actualStart],
    factory,
    scopeBag: bag,
    span: seq.length,
  })
}

function matchOrInner(
  actual: unknown,
  args: unknown[],
  namedBindings: NamedBinding[],
  configDefaults: Record<string, unknown> = {},
  parentKey?: string,
  ctx?: Ctx,
  path: Path = [],
): Record<string, unknown> | null {
  for (const arg of args) {
    const result = matchValueInner(
      actual,
      arg,
      namedBindings,
      configDefaults,
      parentKey,
      ctx,
      path,
    )
    if (result) return result
  }

  return null
}

function matchMaybeBlockInner(
  actual: unknown,
  stmtPattern: unknown,
  namedBindings: NamedBinding[],
  configDefaults: Record<string, unknown> = {},
  ctx?: Ctx,
  path: Path = [],
): Record<string, unknown> | null {
  const actualRec = actual as Record<string, unknown> | null | undefined

  if (
    actualRec?.type === 'BlockStatement' &&
    Array.isArray(actualRec.body) &&
    actualRec.body.length === 1
  ) {
    const result = matchValueInner(
      (actualRec.body as unknown[])[0],
      stmtPattern,
      namedBindings,
      configDefaults,
      undefined,
      ctx,
      [...path, 'body', 0],
    )
    if (result) return result
  }

  return matchValueInner(
    actual,
    stmtPattern,
    namedBindings,
    configDefaults,
    undefined,
    ctx,
    path,
  )
}

const SKIP_KEYS = new Set(['parent', 'loc', 'range'])

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true

  if (a == null || b == null) return false

  if (typeof a !== typeof b) return false

  if (typeof a !== 'object') return false

  if (Array.isArray(a) !== Array.isArray(b)) return false

  if (Array.isArray(a)) {
    return (
      a.length === (b as unknown[]).length &&
      a.every((v: unknown, i: number) => deepEqual(v, (b as unknown[])[i]))
    )
  }

  const aRec = a as Record<string, unknown>
  const bRec = b as Record<string, unknown>
  const keysA = Object.keys(aRec).filter(k => !SKIP_KEYS.has(k))

  return (
    keysA.length === Object.keys(bRec).filter(k => !SKIP_KEYS.has(k)).length &&
    keysA.every(k => deepEqual(aRec[k], bRec[k]))
  )
}

/**
 * Check `.when()` guards in a proxy node's chain.
 * Returns true if all guards pass (or there are none), false otherwise.
 */
function applyWhenGuards(chain: ChainEntry[], bag: Record<string, unknown>) {
  for (const entry of chain) {
    if (entry.method === 'when') {
      const guardFn = entry.args[0]
      if (typeof guardFn === 'function' && !guardFn(bag)) return false
    }
  }

  return true
}

/**
 * Enforce `.where()` chain entries. Each entry carries one or more
 * constraint patterns. Each pattern's chain carries a quantifier
 * (`.none()`, `.some()`, `.atLeast(N)`, `.atMost(N)`, `.exactly(N)`)
 * and an optional scope modifier (`.until()` for subtree boundaries).
 */
function applyWhere(chain: ChainEntry[], actual: unknown) {
  for (const entry of chain) {
    if (entry.method !== 'where') continue

    for (const constraint of entry.args) {
      if (!isProxyNode(constraint)) continue

      const cNode = SymGet.symGet(constraint, NODE) as ProxyNode
      const untilEntry = chainGet(cNode.chain, 'until')
      const boundary = untilEntry?.args[0] ?? null
      const q = readQuantifier(cNode.chain)

      if (!q) continue

      if (q.kind === 'none') {
        if (subtreeCount(actual, cNode, boundary, 1) > 0) return false

        continue
      }

      if (!q.test(subtreeCount(actual, cNode, boundary))) return false
    }
  }

  return true
}

type Quantifier = { kind: string; test: (n: number) => boolean }

function readQuantifier(chain: ChainEntry[]): Quantifier | null {
  if (chainHas(chain, 'none')) return { kind: 'none', test: n => n === 0 }
  if (chainHas(chain, 'some')) return { kind: 'some', test: n => n > 0 }
  const atLeast = chainGet(chain, 'atLeast')

  if (atLeast) {
    const k = (atLeast.args[0] ?? 0) as number

    return { kind: 'atLeast', test: n => n >= k }
  }

  const atMost = chainGet(chain, 'atMost')

  if (atMost) {
    const k = (atMost.args[0] ?? 0) as number

    return { kind: 'atMost', test: n => n <= k }
  }

  const exactly = chainGet(chain, 'exactly')

  if (exactly) {
    const k = (exactly.args[0] ?? 0) as number

    return { kind: 'exactly', test: n => n === k }
  }

  return null
}

/**
 * Count how many descendants of `root` match the pattern, respecting
 * `.until()` boundaries. The root itself is NOT checked.
 *
 * @param limit Stop counting early once this limit is reached (optimization).
 */
function subtreeCount(
  root: unknown,
  pattern: ProxyNode,
  boundary: unknown,
  limit?: number,
) {
  const rootRec = root as Record<string, unknown> | null | undefined
  if (!rootRec || typeof rootRec !== 'object') return 0
  let count = 0

  for (const key of Object.keys(rootRec)) {
    if (SKIP_KEYS.has(key)) continue
    const child = rootRec[key]

    if (Array.isArray(child)) {
      for (const item of child) {
        count += countDescendant(
          item,
          pattern,
          boundary,
          limit ? limit - count : undefined,
        )
        if (limit && count >= limit) return count
      }
    } else if (
      child &&
      typeof child === 'object' &&
      (child as Record<string, unknown>).type
    ) {
      count += countDescendant(
        child,
        pattern,
        boundary,
        limit ? limit - count : undefined,
      )
      if (limit && count >= limit) return count
    }
  }

  return count
}

/**
 * Check a single descendant and recurse. Returns the number of matches
 * found in this node and its subtree.
 */
function countDescendant(
  node: unknown,
  pattern: ProxyNode,
  boundary: unknown,
  limit?: number,
): number {
  const nodeRec = node as Record<string, unknown> | null | undefined
  if (!nodeRec || typeof nodeRec !== 'object' || !nodeRec.type) return 0
  let count = 0

  // Check if this node matches the pattern. Handle U.or().
  if (pattern.tag === 'or') {
    for (const alt of pattern.args) {
      if (!isProxyNode(alt)) continue
      const inner = SymGet.symGet(alt, NODE) as ProxyNode

      if (nodeRec.type === inner.tag) {
        const innerPattern = inner.args[0] ?? {}

        if (matchInner(node, innerPattern as Record<string, unknown>, [], {})) {
          count++
          break // One match per node is enough
        }
      }
    }
  } else if (nodeRec.type === pattern.tag) {
    const innerPattern = pattern.args[0] ?? {}

    if (matchInner(node, innerPattern as Record<string, unknown>, [], {})) {
      count++
    }
  }

  if (limit && count >= limit) return count

  // If this node is a boundary, don't recurse.
  if (boundary && isBoundaryNode(nodeRec, boundary)) return count

  // Recurse into children.
  for (const key of Object.keys(nodeRec)) {
    if (SKIP_KEYS.has(key)) continue
    const child = nodeRec[key]

    if (Array.isArray(child)) {
      for (const item of child) {
        count += countDescendant(
          item,
          pattern,
          boundary,
          limit ? limit - count : undefined,
        )
        if (limit && count >= limit) return count
      }
    } else if (
      child &&
      typeof child === 'object' &&
      (child as Record<string, unknown>).type
    ) {
      count += countDescendant(
        child,
        pattern,
        boundary,
        limit ? limit - count : undefined,
      )
      if (limit && count >= limit) return count
    }
  }

  return count
}

/**
 * Check if a node matches a boundary pattern. The boundary can be a
 * proxy node (single type) or an or-proxy (multiple types).
 */
function isBoundaryNode(node: Record<string, unknown>, boundary: unknown) {
  if (!isProxyNode(boundary)) return false

  const bNode = SymGet.symGet(boundary, NODE) as ProxyNode

  return bNode.tag === 'or'
    ? bNode.args.some((arg: unknown) =>
        typeof arg === 'string'
          ? node.type === arg
          : isProxyNode(arg)
            ? node.type === (SymGet.symGet(arg, NODE) as ProxyNode).tag
            : false,
      )
    : node.type === bNode.tag
}

const isCapture = (
  v: unknown,
): v is {
  name: string
} =>
  v != null && typeof v === 'object' && SymGet.symGet(v, CAPTURE_BRAND) === true

const isConfigSlot = (
  v: unknown,
): v is {
  name: string
} =>
  v != null && typeof v === 'object' && SymGet.symGet(v, CONFIG_BRAND) === true

function isRawComment(v: unknown) {
  const t = (v as { type?: unknown } | null | undefined)?.type

  return t === 'Line' || t === 'Block'
}

const isProxyNode = (v: unknown) =>
  typeof v === 'function' && SymGet.symGet(v, NODE) != null

const chainHas = (chain: ChainEntry[], method: string) =>
  chain.some(e => e.method === method)

const chainGet = (
  chain: ChainEntry[],
  method: string,
): ChainEntry | undefined => chain.find(e => e.method === method)

/**
 * Resolve config defaults from a chain. The `.config({ key: value })` entry
 * carries the default values for config slots used in the pattern and output.
 */
function extractConfigDefaults(chain: ChainEntry[]): Record<string, unknown> {
  const configEntry = chainGet(chain, 'config')

  return (configEntry?.args[0] ?? {}) as Record<string, unknown>
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
  parentKey?: string,
): Record<string, unknown> {
  const bindEntry = chainGet(chain, 'bind')

  if (bindEntry) {
    return {
      [(bindEntry.args[0] as string | undefined) ?? parentKey ?? 'node']:
        actual,
    }
  }

  if (chainHas(chain, 'seal') && parentKey) {
    const keys = Object.keys(bag)

    return keys.length === 1
      ? {
          [parentKey]: bag[keys[0]],
        }
      : keys.length === 0
        ? {}
        : bag
  }

  return bag
}
