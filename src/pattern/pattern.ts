import type { Capturable } from "@/capture/capturable";

type PatternChildren<T> = {
  [K in keyof T as T extends readonly any[]
    ? K extends `${number}`
      ? K
      : never
    : K]: Pattern<T[K]>;
};

/**
 * Deeply capturable pattern for a shape `T`.
 *
 * At any position you may either:
 * - Recurse into children (nested pattern), or
 * - Capture the whole subtree using a capture token (implicit or explicit).
 *
 * Objects and tuples allow either a nested pattern of their children or a
 * subtree capture; primitives are capturable values.
 */
export type Pattern<T> = T extends object
  ? Capturable<T> | PatternChildren<T>
  : Capturable<T>;
