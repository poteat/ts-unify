import type { ExtractCaptures } from '@/pattern/extract-captures'

/**
 * The names of the captures a node shape declares.
 */
export type CaptureKeys<N> = keyof ExtractCaptures<N>
