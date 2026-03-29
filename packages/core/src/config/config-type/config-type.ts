export const CONFIG_BRAND = Symbol("CONFIG_BRAND");

/**
 * Marks a position in a pattern or output as configurable by the user.
 * Parallel to `Capture` but for injecting values from config rather
 * than extracting from matched source.
 */
export type ConfigSlot<Name extends string = string, Value = unknown> = {
  readonly [CONFIG_BRAND]: true;
  readonly name: Name;
  readonly value?: Value;
};
