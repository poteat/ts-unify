import type { MaybeBlockBody, NodeBody, OrBody } from './shapes'
/**
 * What a proxy node's tag and arguments ask of the value, by the kind of
 * proxy.
 */
export type ProxyBody = OrBody | MaybeBlockBody | NodeBody
