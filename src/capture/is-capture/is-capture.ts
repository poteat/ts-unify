import type { Capture } from "../capture-type";
import { CAPTURE_BRAND } from "../capture-type";

/**
 * Type guard to check if a value is a capture sentinel.
 */
export const isCapture = (value: unknown): value is Capture =>
  typeof value === "object" &&
  value !== null &&
  CAPTURE_BRAND in value &&
  value[CAPTURE_BRAND] === true;
