import { POSITION_KEYS } from './position-keys'

/**
 * The keys of a node that carry its structure: all but `POSITION_KEYS`.
 *
 * @param rec the node
 */
export const structuralKeys = (rec: Record<string, unknown>) =>
  Object.keys(rec).filter(k => !POSITION_KEYS.has(k))
