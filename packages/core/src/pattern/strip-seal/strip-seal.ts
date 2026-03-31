import type { Sealed } from "@/ast/sealed";

export type StripSeal<T> = T extends Sealed<infer Inner> ? Inner : T;
