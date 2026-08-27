import Position from './position'
/**
 * The keys of a node that carry its structure: all but `POSITION_KEYS`.
 *
 * @param rec the node
 * @returns the node's keys with the position keys filtered out
 */
export const structuralKeys = (rec: Record<string, unknown>) =>
  Object.keys(rec).filter(k => !Position.POSITION_KEYS.has(k))
