/**
 * How the source editor is set up: no minimap, a 13px monospace face, a
 * little padding, no line highlight and no scrolling past the last line.
 */
export const EDITOR_OPTIONS = {
  minimap: { enabled: false },
  fontSize: 13,
  scrollBeyondLastLine: false,
  renderLineHighlight: 'none',
  padding: { top: 10, bottom: 10 },
  fontFamily: 'JetBrains Mono, SF Mono, ui-monospace, Menlo, monospace',
} as const
