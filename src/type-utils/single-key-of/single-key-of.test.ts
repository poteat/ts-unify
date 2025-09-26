import { assertType } from "@/test-utils/assert-type/assert-type";
import type { SingleKeyOf } from "./single-key-of";

describe("SingleKeyOf", () => {
  it("yields the only key for single-key objects", () => {
    type K = SingleKeyOf<{ a: 1 }>;
    assertType<K, "a">(0);
  });

  it("is never for multi-key objects", () => {
    type K = SingleKeyOf<{ a: 1; b: 2 }>;
    assertType<K, never>(0);
  });

  it("is never for empty objects and non-objects", () => {
    type K1 = SingleKeyOf<{}>;
    type K2 = SingleKeyOf<string>;
    assertType<K1, never>(0);
    assertType<K2, never>(0);
  });
});
