import type { RuleMeta } from '../extract-rule-meta'
import Lint from '../lint'
import type { LintMatch } from '../lint'
import type { FixOptions } from './fix-options'
import { MAX_ITERATIONS } from './max-iterations'
import { nonOverlapping } from './non-overlapping'

/**
 * Apply all rule rewrites to the source text in a fixpoint loop, until the
 * text is stable or the iteration cap is reached.
 *
 * Each iteration lints, keeps the non-overlapping fixable matches, and
 * splices their serialized rewrites in, last to first.
 *
 * @param source the text to fix
 * @param rules the rules to run
 * @param options how to parse and serialize, and the iteration cap
 */
export function fix(
  source: string,
  rules: readonly RuleMeta[],
  options: FixOptions,
) {
  const { parse, serialize, maxIterations = MAX_ITERATIONS } = options
  let current = source

  for (let iter = 0; iter < maxIterations; iter++) {
    let ast: unknown

    try {
      ast = parse(current)
    } catch {
      break
    }

    const fixable = Lint.lint(ast, rules).filter(
      (
        m,
      ): m is LintMatch & {
        reified: object
      } => m.reified != null,
    )

    if (fixable.length === 0) break
    const usable = nonOverlapping(fixable)
    if (usable.length === 0) break
    const lines = [...current.split('\n')]

    for (let i = usable.length - 1; i >= 0; i--) {
      const m = usable[i]
      let text: string

      try {
        text = serialize(m.reified)
      } catch {
        continue
      }

      lines.splice(
        m.line - 1,
        m.endLine - m.line + 1,
        ...(
          (lines[m.line - 1] ?? '').slice(0, m.column - 1) +
          text +
          (lines[m.endLine - 1] ?? '').slice(m.endColumn - 1)
        ).split('\n'),
      )
    }

    const next = lines.join('\n')

    if (next === current) break

    current = next
  }

  return current
}
