import Theme from '@ts-unify/playground/app/theme'
import type { DiffViewProps } from '@ts-unify/playground/app/types'
import { useMemo } from 'react'

import Diff from './diff'
import Spans from './spans'

/**
 * The diff the fixes would make: every line of the source kept, removed
 * or added, colored as code, rebuilt only when its inputs change.
 *
 * @param props the source, the matches and the Monaco instance
 * @returns the view
 */
export const DiffView = ({ code, matches, monaco }: DiffViewProps) =>
  useMemo(
    () => (
      <div className="diff-view">
        {Diff.buildDiff(code, matches).map((row, i) => (
          <div key={i} className={Diff.DIFF_LINE_CLASS[row.kind]}>
            <span className="gutter">{row.kind === 'add' ? '' : row.num}</span>
            <span className="content">
              <Spans.ColoredSpans
                spans={Theme.tokenizeLine(monaco, row.line, 'typescript')}
              />
            </span>
          </div>
        ))}
      </div>
    ),
    [code, matches, monaco],
  )
