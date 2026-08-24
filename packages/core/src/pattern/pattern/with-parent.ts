import type { ParentPattern } from './parent-pattern'

/**
 * The optional `parent` key an object pattern may carry to constrain the
 * parent node; it contributes no captures.
 */
export type WithParent = { parent?: ParentPattern }
