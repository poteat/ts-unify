import { U, $ } from '@ts-unify/core'

import { inlinableConst } from './inlinable-const'
import { substituted } from './substituted'

/**
 * A `const` whose one read is in the very next statement goes, and that
 * read becomes its initializer.
 *
 * Every single-declarator `const` of the block is tried, first to last;
 * `inlinableConst` picks the one, and an annotated const keeps its check.
 *
 * @example `const h = config.onError; h?.(err)` becomes
 * `config.onError?.(err)`
 */
export const inlineSingleUseConst = U.BlockStatement({ body: $('body') })
  .when(bag => inlinableConst((bag as { body?: unknown }).body) !== null)
  .to(bag => {
    const body = (bag as { body?: unknown }).body
    const it = inlinableConst(body)
    const list = body as unknown[]
    if (!it) return { type: 'BlockStatement', body: list }
    const next = substituted(list[it.index + 1], it.read, it.init)

    return {
      type: 'BlockStatement',
      body: [...list.slice(0, it.index), next, ...list.slice(it.index + 2)],
    }
  })
  .message('Inline single-use const')
