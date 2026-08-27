import CaptureType from '@/capture/capture-type'

/**
 * Type guard for a capture sentinel: an object carrying the capture brand.
 *
 * @param value what to test
 * @returns true when the value is an object carrying the capture brand
 */
export const isCapture = (value: unknown): value is CaptureType.Capture =>
  typeof value === 'object' &&
  value !== null &&
  CaptureType.CAPTURE_BRAND in value &&
  value[CaptureType.CAPTURE_BRAND] === true
