import type { ConfigSlot } from '@/config/config-type'

/**
 * The config shape an import map asks for: a string entry per config slot
 * among its values, keyed by the slot's name.
 */
export type ExtractConfigFromImports<M> = {
  [K in keyof M as M[K] extends ConfigSlot<infer N, unknown>
    ? N
    : never]: string
}
