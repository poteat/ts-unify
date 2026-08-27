import TsGenerate from '@ts-unify/playground/app/ts-generate'
import { fix } from '@ts-unify/runner'

import Catalog from './catalog'
import Util from './util'

/**
 * The source with every non-overlapping fix of the enabled rules applied.
 *
 * @param source the source text
 * @param enabled the kebab names of the enabled rules
 * @returns the rewritten source
 */
export const applyFixes = (source: string, enabled: ReadonlySet<string>) =>
  fix(source, Catalog.enabledRules(enabled), {
    parse: Util.parseSafe,
    serialize: TsGenerate.tsGenerate,
  })
