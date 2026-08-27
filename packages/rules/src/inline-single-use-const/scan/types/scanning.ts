import type { Analysis, Tally } from './analysis'

/**
 * A block being scanned: its tallies, written to, and the analysis of a
 * block nested under it, built once per block.
 */
export type Scanning = {
  tallies: Map<string, Tally>

  /**
   * What a nested block's statements come to, built once per block.
   */
  analysisOf: (body: unknown[]) => Analysis
}
