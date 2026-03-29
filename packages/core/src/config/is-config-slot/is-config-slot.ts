import type { ConfigSlot } from "@/config/config-type";
import { CONFIG_BRAND } from "@/config/config-type";

/** Type guard to check if a value is a config slot. */
export const isConfigSlot = (value: unknown): value is ConfigSlot =>
  typeof value === "object" &&
  value !== null &&
  CONFIG_BRAND in value &&
  value[CONFIG_BRAND] === true;
