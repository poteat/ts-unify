import Theme from '@ts-unify/playground/app/theme'
import type { HighlightedCodeProps } from '@ts-unify/playground/app/types'
import { useMemo } from 'react'

import Spans from './spans'

/**
 * A read-only code view colored by Monaco's tokenizer, rebuilt only when
 * the text, the Monaco instance or the language changes.
 *
 * @param props the text, the Monaco instance and the language
 * @returns the view
 */
export const HighlightedCode = ({
  code,
  monaco,
  language = 'typescript',
}: HighlightedCodeProps) =>
  useMemo(
    () => (
      <pre className="code-view">
        {code.split('\n').map((line, i) => (
          <div key={i} className="code-line">
            <Spans.ColoredSpans
              spans={Theme.tokenizeLine(monaco, line, language)}
            />
          </div>
        ))}
      </pre>
    ),
    [code, monaco, language],
  )
