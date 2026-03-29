import { CONFIG_BRAND } from "@/config/config-type";
import type { ConfigSlot } from "@/config/config-type";

export interface C {
  <const Name extends string>(name: Name): ConfigSlot<Name, unknown>;
}

/** Create a named config slot. */
export const C: C = (<const Name extends string>(name: Name) => {
  return Object.freeze({
    [CONFIG_BRAND]: true,
    name,
  });
}) as C;
