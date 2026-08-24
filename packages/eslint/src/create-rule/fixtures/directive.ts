/**
 * Tool directives, by their first token.
 */
export const DIRECTIVE = new RegExp(
  String.raw`^\s*(oxlint-|eslint-|eslint\s|eslint$|` +
    String.raw`@ts-(expect-error|ignore|nocheck|check)\b|prettier-ignore|` +
    'biome-ignore|c8 ignore|v8 ignore|istanbul ignore)',
)
