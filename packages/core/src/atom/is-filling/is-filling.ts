import type { Filling } from '@/atom/filling'
import IsKeyed from '@/atom/is-keyed'

/**
 * Whether a value is a definition: a slot, a deps object and a read
 * function.
 */
export const isFilling = (value: unknown): value is Filling =>
  typeof value === 'object' &&
  value !== null &&
  'slot' in value &&
  IsKeyed.isKeyed(value.slot) &&
  'deps' in value &&
  typeof value.deps === 'object' &&
  'read' in value &&
  typeof value.read === 'function'
