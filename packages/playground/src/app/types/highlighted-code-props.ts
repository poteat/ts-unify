import type { Monaco } from '@monaco-editor/react'

/**
 * What a read-only code view shows: the text, the Monaco instance that
 * colors it (none before the editor mounts), and the language it is in.
 */
export type HighlightedCodeProps = {
  code: string
  monaco: Monaco | null
  language?: string
}
