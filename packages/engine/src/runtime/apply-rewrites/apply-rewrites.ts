import { reify } from "../reify";
import type { Path, RewriteSite } from "../match";

const SKIP_KEYS = new Set(["parent", "loc", "range", "tokens", "comments"]);

/**
 * Deep-clone an AST node, dropping non-structural metadata (parent links,
 * source positions) so the clone is safe to mutate and serialize.
 */
function cloneNode(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(cloneNode);
  if (node == null || typeof node !== "object") return node;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(node as Record<string, unknown>)) {
    if (SKIP_KEYS.has(key)) continue;
    out[key] = cloneNode((node as Record<string, unknown>)[key]);
  }
  return out;
}

/** True iff `prefix` is a prefix of `path` (or equal to it). */
function isPathPrefix(prefix: Path, path: Path): boolean {
  if (prefix.length > path.length) return false;
  for (let i = 0; i < prefix.length; i++) {
    if (prefix[i] !== path[i]) return false;
  }
  return true;
}

/**
 * Get the parent container at the given path (everything except the last
 * segment) and the last-segment key. For an empty path, returns
 * `{ parent: null, key: null }` to signal a root replacement.
 */
function locateParent(
  root: Record<string, unknown> | unknown[],
  path: Path,
): { parent: Record<string, unknown> | unknown[] | null; key: string | number | null } {
  if (path.length === 0) return { parent: null, key: null };
  let cursor: unknown = root;
  for (let i = 0; i < path.length - 1; i++) {
    const seg = path[i];
    cursor = (cursor as Record<string | number, unknown>)[seg as never];
    if (cursor == null) return { parent: null, key: null };
  }
  return {
    parent: cursor as Record<string, unknown> | unknown[],
    key: path[path.length - 1],
  };
}

/**
 * Apply a list of inner-`.to()` rewrite sites to a matched AST node.
 *
 * Strategy:
 * 1. Clone the matched node.
 * 2. Sort sites deepest-first so inner rewrites complete before outer ones
 *    read their captures.
 * 3. For each site: run its factory on the (shared, mutating) bag, reify
 *    the result, splice it into the clone at the recorded path, and rebind
 *    any captures whose source path was at-or-under that position.
 * 4. Return the rewritten clone (or the root replacement if a site at
 *    path `[]` produced one).
 *
 * If no sites are present, returns null (caller can decide whether that
 * means "no rewrite").
 */
export function applyRewrites(
  matchedNode: unknown,
  sites: ReadonlyArray<RewriteSite>,
  capturePaths: Record<string, Path> = {},
  sourceCode?: unknown,
): unknown {
  if (sites.length === 0) return null;

  let root: unknown = cloneNode(matchedNode);

  // Deepest-first; ties broken arbitrarily (sibling sites are spatially
  // disjoint by construction so order between them doesn't matter).
  const ordered = [...sites].sort((a, b) => b.path.length - a.path.length);

  for (const site of ordered) {
    const result = site.factory(site.scopeBag);
    const reified = reify(result, sourceCode);

    if (site.path.length === 0) {
      // Root replacement.
      root = reified;
      // Rebind every capture (they all live at-or-under the root).
      for (const name of Object.keys(capturePaths)) {
        site.scopeBag[name] = reified;
      }
      continue;
    }

    const { parent, key } = locateParent(root as Record<string, unknown> | unknown[], site.path);
    if (parent == null || key == null) continue;

    if (Array.isArray(parent) && typeof key === "number") {
      const span = site.span ?? 1;
      const replacement = Array.isArray(reified) ? reified : [reified];
      parent.splice(key, span, ...replacement);
    } else {
      (parent as Record<string, unknown>)[key as string] = reified;
    }

    // Rebind captures whose source was at-or-under this site's path.
    // Skip for seq sites (span > 1): the seq's factory already consumed
    // its inner captures, and the multi-element span makes "what would
    // the new value of an inner capture be" ill-defined.
    if (site.span === undefined || site.span === 1) {
      for (const [name, capPath] of Object.entries(capturePaths)) {
        if (isPathPrefix(site.path, capPath)) {
          site.scopeBag[name] = reified;
        }
      }
    }
  }

  return root;
}
