import { viewsMemo } from './views-memo'

/**
 * The one memo of the module: a program's comment views, built on the
 * first read and kept for the program's lifetime.
 */
export const commentViews = viewsMemo()
