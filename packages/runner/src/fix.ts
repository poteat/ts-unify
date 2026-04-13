import type { RuleMeta } from "./extract-rule-meta";
import type { LintMatch } from "./lint";
import { lint } from "./lint";

export type FixOptions = {
  /** Parse source text into an AST (with loc/range). */
  parse: (source: string) => unknown;
  /** Serialize a reified ESTree node back to source text. */
  serialize: (node: unknown) => string;
  /** Maximum fixpoint iterations (default 10). */
  maxIterations?: number;
};

/**
 * Apply all rule rewrites to the source text in a fixpoint loop.
 * Each iteration lints, keeps non-overlapping fixable matches, and
 * splices their serialized rewrites in. Repeats until stable or the
 * iteration cap is reached.
 */
export function fix(
  source: string,
  rules: RuleMeta[],
  options: FixOptions
): string {
  const { parse, serialize, maxIterations = 10 } = options;
  let current = source;

  for (let iter = 0; iter < maxIterations; iter++) {
    let ast: unknown;
    try {
      ast = parse(current);
    } catch {
      break;
    }

    const matches = lint(ast, rules);
    const fixable = matches.filter(
      (m): m is LintMatch & { reified: object } => m.reified != null
    );
    if (fixable.length === 0) break;

    // Sort by position, keep non-overlapping (earliest wins).
    fixable.sort((a, b) =>
      a.line !== b.line ? a.line - b.line : a.column - b.column
    );
    const nonOverlapping: (LintMatch & { reified: object })[] = [];
    let lastEndLine = -1;
    let lastEndCol = -1;
    for (const m of fixable) {
      if (
        m.line > lastEndLine ||
        (m.line === lastEndLine && m.column >= lastEndCol)
      ) {
        nonOverlapping.push(m);
        lastEndLine = m.endLine;
        lastEndCol = m.endColumn;
      }
    }
    if (nonOverlapping.length === 0) break;

    // Splice each fix in reverse document order.
    const lines = current.split("\n");
    for (let i = nonOverlapping.length - 1; i >= 0; i--) {
      const m = nonOverlapping[i];
      let text: string;
      try {
        text = serialize(m.reified);
      } catch {
        continue;
      }
      const firstLine = lines[m.line - 1] ?? "";
      const lastLine = lines[m.endLine - 1] ?? "";
      const prefix = firstLine.slice(0, m.column - 1);
      const suffix = lastLine.slice(m.endColumn - 1);
      const replaced = (prefix + text + suffix).split("\n");
      lines.splice(m.line - 1, m.endLine - m.line + 1, ...replaced);
    }

    const next = lines.join("\n");
    if (next === current) break;
    current = next;
  }

  return current;
}
