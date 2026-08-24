/**
 * One text edit ESLint applies: the range it replaces and the new text.
 */
export type RuleFix = { range: [number, number]; text: string }
