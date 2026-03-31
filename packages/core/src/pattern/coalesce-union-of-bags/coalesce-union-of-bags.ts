import type { KeysOfUnion } from "@/type-utils";

export type CoalesceUnionOfBags<U> = {
  [K in KeysOfUnion<U>]: U extends unknown
    ? K extends keyof U
      ? U[K]
      : never
    : never;
};
