import { U, $ } from '@ts-unify/core'

import { coalesced } from './coalesced'
import { nullCheck } from './null-check'
import { returnOfValue } from './return-of-value'

/**
 * A guard that returns a fallback when a value is `null`, followed by a
 * return of the value, is one return of `value ?? fallback`.
 *
 * The value's type has to be `T | null` with no `undefined` in `T`, since
 * `??` also takes `undefined`. An `as` on the returned value moves onto
 * the coalesced one.
 *
 * @example `if (v === null) return d; return v` becomes `return v ?? d`
 */
export const collapseNullGuard = U.BlockStatement({
  body: [...$, nullCheck, returnOfValue],
})
  .to(({ body, value, fallback, typeAnnotation }) =>
    U.BlockStatement({
      body: [
        ...body,
        U.ReturnStatement({
          argument: coalesced(value, fallback, typeAnnotation),
        }),
      ],
    }),
  )
  .message('Collapse null guard with early return into nullish coalescing')
  .recommended()
