import MakeProxy from './make-proxy'
import type { BuilderMap } from './types'

/**
 * AST pattern builder namespace.
 */
export const U = MakeProxy.makeProxy() as BuilderMap
