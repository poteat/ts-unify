import type { Factory } from './factory'

/**
 * The factory a zero-argument `.to()` stands for: the output is the bag's
 * one capture value (node-with-to.spec.md).
 */
export const singleCaptureFactory: Factory = bag => Object.values(bag)[0]
