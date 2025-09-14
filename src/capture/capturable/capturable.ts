import type { CaptureLike } from "@/capture/capture-like";

/**
 * Capturable<T> allows a position to be either the original value type `T`
 * or a capture token (implicit or explicit).
 */
export type Capturable<T> = T | CaptureLike<T>;
