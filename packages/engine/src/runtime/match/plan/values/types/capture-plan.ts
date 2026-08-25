/**
 * The plan of a named capture, `$('name')`: capture the value under the
 * name and record the binding.
 */
export type CapturePlan = { kind: 'capture'; name: string }
