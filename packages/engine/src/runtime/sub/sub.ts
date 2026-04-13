const SKIP_KEYS = new Set(["parent", "loc", "range"]);

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, (b as unknown[])[i]));
  }
  const aRec = a as Record<string, unknown>;
  const bRec = b as Record<string, unknown>;
  const aKeys = Object.keys(aRec).filter((k) => !SKIP_KEYS.has(k));
  const bKeys = Object.keys(bRec).filter((k) => !SKIP_KEYS.has(k));
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((k) => deepEqual(aRec[k], bRec[k]));
}

/**
 * Check whether `target` appears anywhere in `tree` (structural equality,
 * ignoring parent/loc/range).
 */
export function contains(tree: unknown, target: unknown): boolean {
  if (deepEqual(tree, target)) return true;
  if (tree == null || typeof tree !== "object") return false;
  if (Array.isArray(tree)) return tree.some((v) => contains(v, target));
  for (const [k, v] of Object.entries(tree as Record<string, unknown>)) {
    if (SKIP_KEYS.has(k)) continue;
    if (contains(v, target)) return true;
  }
  return false;
}

/**
 * Structural substitution on an AST tree. Every node structurally equal
 * to `target` is replaced with `replacement`. Returns a new tree.
 */
export function sub<T>(
  tree: T,
  target: unknown,
  replacement: unknown
): T {
  if (deepEqual(tree, target)) return replacement as T;
  if (tree == null || typeof tree !== "object") return tree;
  if (Array.isArray(tree)) {
    return tree.map((v) => sub(v, target, replacement)) as T;
  }
  const rec = tree as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(rec)) {
    if (SKIP_KEYS.has(k)) {
      result[k] = v;
      continue;
    }
    result[k] = sub(v, target, replacement);
  }
  return result as T;
}
