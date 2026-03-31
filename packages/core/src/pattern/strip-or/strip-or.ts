import type { OR_BRAND } from "@/ast/or";

export type StripOr<T> = T extends { readonly [OR_BRAND]: true }
  ? Omit<T, typeof OR_BRAND>
  : T;
