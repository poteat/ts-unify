import { U } from '@ts-unify/core/internal'

import type { LooseBuilder } from './loose-builder'

/**
 * `U` with its types off, for patterns the typed builder refuses: two
 * sibling `.to()` sites in one body, or a node where a primitive goes.
 */
export const LOOSE_U = U as unknown as LooseBuilder
