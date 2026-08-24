import type { MaybeBlockBody } from './maybe-block-body'
import type { NodeBody } from './node-body'
import type { OrBody } from './or-body'

/**
 * What a proxy node's tag and arguments ask of the value, by the kind of
 * proxy.
 */
export type ProxyBody = OrBody | MaybeBlockBody | NodeBody
