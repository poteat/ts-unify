import { CONFIG_BRAND } from '@ts-unify/core/internal'
import SymGet from '@ts-unify/engine/runtime/sym-get'
/**
 * Whether a pattern value is a config slot, such as `C('name')`.
 *
 * @param v the pattern value
 */
export const isConfigSlot = (v: unknown): v is { name: string } =>
  v != null && typeof v === 'object' && SymGet.symGet(v, CONFIG_BRAND) === true
