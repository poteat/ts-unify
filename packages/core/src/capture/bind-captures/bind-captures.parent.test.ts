import type { BindCaptures, Capture } from "@/capture";
import type { $ } from "@/capture";
import { assertType } from "@/test-utils/assert-type";

describe("BindCaptures: ignores 'parent' key in object patterns", () => {
  it("binds only real shape keys and omits 'parent' from bound shape", () => {
    type Shape = { a: number };
    type P = { parent: { id: $ }; a: $ };
    type Bound = BindCaptures<P, Shape>;
    type Expected = { a: Capture<"a", number> };
    assertType<Bound, Expected>(0);
  });
});

