import type { Keyed } from '@/atom/keyed'

/**
 * A parent store's door, handed to a scope: what the scope does not fill
 * itself it reads through here.
 */
export type Above = {
  /**
   * The value of a slot the parent fills, built on first use.
   */
  readonly resolve: (slot: Keyed, asker?: Keyed) => unknown

  /**
   * Whether the parent, or a parent of its own, fills the slot.
   */
  readonly fills: (slot: Keyed) => boolean
}
