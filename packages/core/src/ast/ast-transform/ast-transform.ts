import type { ExtractCaptures } from '@/pattern'

import type { ExtractConfigFromImports, ImportMap } from './imports'

/**
 * What `.to(...)` produces: the input pattern, an output factory, and the
 * config shape accumulated from every position.
 */
export type AstTransform<In, Out, Cfg extends Record<string, unknown> = {}> = {
  readonly from: In

  /**
   * Builds the output from the captures of one match.
   */
  readonly to: (bag: ExtractCaptures<In>) => Out

  readonly importMap?: ImportMap

  /**
   * Records the imports the output needs; a config slot among them adds
   * its name to the config shape.
   */
  readonly imports: <M extends ImportMap>(
    map: M,
  ) => AstTransform<In, Out, Cfg & ExtractConfigFromImports<M>>

  /**
   * Sets the config defaults, and with them the config shape.
   */
  readonly config: <D extends Cfg>(defaults: D) => AstTransform<In, Out, D>

  /**
   * Marks the rule as recommended.
   */
  readonly recommended: () => AstTransform<In, Out, Cfg>

  /**
   * Sets the text a report carries.
   */
  readonly message: (text: string) => AstTransform<In, Out, Cfg>
}
