import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { renderReservedWords } from './reserved-words/render-reserved-words.mjs'
import { TABLES } from './reserved-words/tables.mjs'

for (const table of TABLES) {
  const target = resolve(
    process.argv[2] ?? 'src/string-predicate/reserved/words',
    table.file,
  )

  writeFileSync(target, renderReservedWords(table))
  console.log(`wrote ${target}`)
}
