import type { NormalizeCaptured } from "@/ast/normalize-captured";

/** Normalize each entry of a capture bag. */
export type NormalizeBag<B> = { [K in keyof B]: NormalizeCaptured<B[K]> };

