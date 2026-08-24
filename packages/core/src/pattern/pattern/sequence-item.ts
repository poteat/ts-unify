import type { SEQ_BRAND } from '@/ast/seq-brand'
import type { Spread } from '@/capture'
import type { CaptureLike } from '@/capture/capture-like'

import type { Pattern } from './pattern'

/**
 * What one position of a sequence pattern over elements `E` accepts: a
 * nested pattern, a capture, a spread, or a seq combinator.
 */
export type SequenceItem<E> =
  | Pattern<E>
  | CaptureLike<E>
  | Spread<string, unknown>
  | { readonly [SEQ_BRAND]: unknown }
