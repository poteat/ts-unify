import type { ColoredSpansProps } from './types'

/**
 * One line's text as colored spans, or a space when the line is empty so
 * that it keeps its height.
 *
 * @param props the spans
 * @returns the spans as elements
 */
export function ColoredSpans({ spans }: ColoredSpansProps) {
  const isEmpty = spans.length === 0

  return isEmpty
    ? ' '
    : spans.map((span, i) => (
        <span key={i} style={{ color: span.color }}>
          {span.text}
        </span>
      ))
}
