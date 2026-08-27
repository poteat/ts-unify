import { CAPTURE_BRAND } from '@ts-unify/core/internal'

import Branded from './branded'
/**
 * Whether a pattern value is a named capture, such as `$('name')`: an
 * object branded `CAPTURE_BRAND`.
 */
export const isCapture = Branded.brandedAs(CAPTURE_BRAND)
