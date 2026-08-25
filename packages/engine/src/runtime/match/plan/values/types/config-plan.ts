/**
 * The plan of a config slot, `C('name')`: the value must be the slot's
 * default.
 */
export type ConfigPlan = { kind: 'config'; name: string }
