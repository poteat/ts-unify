import type { SeparatedWrite } from './types'

/**
 * Write each node in turn, the separator between neighbours.
 *
 * @param write the nodes, the separator, and the generator and state
 */
export const writeSeparated = (write: SeparatedWrite) =>
  write.nodes.forEach((node, i) => {
    if (i > 0) write.state.write(write.separator)
    write.table[node.type](node, write.state)
  })
