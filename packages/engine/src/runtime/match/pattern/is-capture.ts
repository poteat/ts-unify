import SymGet from '@engine/runtime/sym-get'
import { CAPTURE_BRAND } from '@ts-unify/core/internal'
/**
 * Whether a pattern value is a named capture, such as `$('name')`.
 *
 * @param v the pattern value
 */
export const isCapture = (v: unknown): v is { name: string } =>
  v != null && typeof v === 'object' && SymGet.symGet(v, CAPTURE_BRAND) === true
