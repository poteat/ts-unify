import type { Capture } from "@/capture/capture-type";
import type { $ } from "@/capture/dollar";

/**
 * CaptureLike is a type-level token that represents either a placeholder
 * token (`$`) or an explicit capture token (`Capture`).
 */
export type CaptureLike<Value = unknown> = $ | Capture<string, Value>;
