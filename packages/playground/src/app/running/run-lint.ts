import type { PlaygroundMatch } from '@ts-unify/playground/app/types'
import { lint } from '@ts-unify/runner'

import Catalog from './catalog'
import Util from './util'

/**
 * The matches of the enabled rules over a source, each with its rewrite
 * serialized for the diff view and the fixes.
 *
 * A source that does not parse yields no matches and the parse error.
 *
 * @param source the source text
 * @param enabled the kebab names of the enabled rules
 * @returns the matches and the program, or the error message with neither
 */
export function runLint(source: string, enabled: ReadonlySet<string>) {
  try {
    const ast = Util.parseSafe(source)

    return {
      matches: lint(ast, Catalog.enabledRules(enabled)).map(match => ({
        ...match,
        rewrite: match.reified
          ? Util.safeSerialize(match.reified, match.rule)
          : null,
      })),
      ast,
      error: null,
    }
  } catch (failure: unknown) {
    return {
      matches: [] as PlaygroundMatch[],
      ast: null,
      error: failure instanceof Error ? failure.message : String(failure),
    }
  }
}
