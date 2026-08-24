import ConfigType from '@/config/config-type'
import type { ConfigSlot } from '@/config/config-type'

/**
 * Creates a frozen config slot: the place in a pattern or output where a
 * value comes from the user's config.
 *
 * @param name the slot's name, kept as a literal type
 */
export const C = <const Name extends string>(
  name: Name,
): ConfigSlot<Name, unknown> =>
  Object.freeze<ConfigSlot<Name, unknown>>({
    [ConfigType.CONFIG_BRAND]: true,
    name,
  })
