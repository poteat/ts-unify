import type { Monaco } from '@monaco-editor/react'

import type { PlaygroundMatch } from './playground-match'

/**
 * What the diff view shows: the source, the matches whose rewrites it
 * applies, and the Monaco instance that colors the lines.
 */
export type DiffViewProps = {
  code: string
  matches: PlaygroundMatch[]
  monaco: Monaco | null
}
