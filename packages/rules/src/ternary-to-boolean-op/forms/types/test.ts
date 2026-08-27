/**
 * The fields a ternary's test is read by: its kind, its operator and
 * operands when it is one, and its value when it is a literal.
 */
export type Test = {
  type: string
  operator?: string
  left?: unknown
  right?: unknown
  argument?: unknown
  value?: unknown
}
