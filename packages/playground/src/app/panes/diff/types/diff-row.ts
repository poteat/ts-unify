/**
 * One line of the diff view: kept, removed or added, with its number in
 * the source when it has one.
 */
export type DiffRow =
  | { kind: 'ctx'; line: string; num: number }
  | { kind: 'del'; line: string; num: number }
  | { kind: 'add'; line: string }
