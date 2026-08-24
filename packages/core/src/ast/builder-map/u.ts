import type { BuilderMap } from './builder-map'
import { makeProxy } from './make-proxy'

/**
 * AST pattern builder namespace.
 */
export const U = makeProxy() as BuilderMap
