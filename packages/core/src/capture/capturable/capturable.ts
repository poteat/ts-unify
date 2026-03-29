import type { CaptureLike } from "@/capture/capture-like";
import type { ConfigSlot } from "@/config/config-type";

/**
 * Capturable<T> allows a position to be either the original value type `T`,
 * a capture token, or a config slot.
 */
export type Capturable<T> = T | CaptureLike<T> | ConfigSlot;
