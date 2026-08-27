import { CONFIG_BRAND } from '@ts-unify/core/internal'

import Branded from './branded'
/**
 * Whether a pattern value is a config slot, such as `C('name')`: an
 * object branded `CONFIG_BRAND`.
 */
export const isConfigSlot = Branded.brandedAs(CONFIG_BRAND)
