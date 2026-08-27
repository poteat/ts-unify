import { generate } from 'astring'

import Generator from './generator'

/**
 * Generate JS/TS source from an ESTree/TSESTree node.
 *
 * @param node the node to print
 * @returns the generated source text
 */
export const tsGenerate = (node: unknown): string =>
  generate(node as Parameters<typeof generate>[0], {
    generator: Generator.tsGenerator,
  })
