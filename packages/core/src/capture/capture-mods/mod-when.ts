/**
 * Modifier recorded by `.when(guard)`: the captured value narrows to what
 * the guard admits.
 *
 * @typeParam Narrow type the guard narrows to
 */
export type ModWhen<Narrow> = { when: Narrow }
