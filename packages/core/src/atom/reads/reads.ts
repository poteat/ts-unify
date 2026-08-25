import type { Filling } from '@/atom/filling'

/**
 * Every slot a definition reads, as a union; distributes over a union of
 * definitions, and is `never` for anything that is not one.
 *
 * @typeParam F the definition, or a union of them
 */
export type Reads<F> = F extends Filling ? F['deps'][keyof F['deps']] : never
