import type { ArrayElem } from '@/capture/bind-captures/shape'

/**
 * The element type a spread binds to: the shape's element when the spread
 * names none, else the part of the spread's element the shape admits.
 *
 * @typeParam Elem element type the spread was written with
 * @typeParam S array or tuple shape the spread matches in
 */
export type SpreadElem<
  Elem,
  S extends readonly unknown[],
> = unknown extends Elem ? ArrayElem<S> : Extract<Elem, ArrayElem<S>>
