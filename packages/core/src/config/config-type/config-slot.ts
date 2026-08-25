import type { CONFIG_BRAND } from './brand'

/**
 * Marks a position in a pattern or output that takes its value from the
 * user's config under `Name`.
 *
 * A capture reads a value out of matched source; a config slot writes one
 * in. `Value` is the type the config supplies.
 */
export type ConfigSlot<Name extends string = string, Value = unknown> = {
  readonly [CONFIG_BRAND]: true
  readonly name: Name

  /**
   * Produces the configured value. A phantom: it carries `Value` for the
   * type level and no slot holds one at runtime.
   */
  readonly value?: () => Value
}
