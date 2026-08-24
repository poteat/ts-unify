/**
 * The fields of a node that the arms of a ternary are read by: its kind,
 * and its value when it is a literal.
 */
export type Arm = { type: string; value?: unknown }
