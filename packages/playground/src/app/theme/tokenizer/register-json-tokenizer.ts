import type { Monaco } from '@monaco-editor/react'

/**
 * Give a Monaco instance a `json` language with a Monarch tokenizer that
 * tells keys from values, registering the language first when it is absent.
 *
 * @param monaco the Monaco instance
 */
export function registerJsonTokenizer(monaco: Monaco) {
  if (
    !monaco.languages
      .getLanguages()
      .some((l: { id: string }) => l.id === 'json')
  ) {
    monaco.languages.register({
      id: 'json',
    })
  }

  monaco.languages.setMonarchTokensProvider('json', {
    tokenizer: {
      root: [
        [/"(?:[^"\\]|\\.)*"(?=\s*:)/, 'string.key.json'],
        [/"(?:[^"\\]|\\.)*"/, 'string.value.json'],
        [/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/, 'number.json'],
        [/\b(?:true|false|null)\b/, 'keyword.json'],
        [/[{}[\],:]/, 'delimiter.json'],
        [/\s+/, ''],
      ],
    },
  })
}
