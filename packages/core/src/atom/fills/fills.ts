import type { Filling } from '@/atom/filling'

/**
 * The slot a definition fills; distributes over a union of definitions,
 * and is `never` for anything that is not one.
 *
 * @typeParam F the definition, or a union of them
 */
export type Fills<F> = F extends Filling ? F['slot'] : never
