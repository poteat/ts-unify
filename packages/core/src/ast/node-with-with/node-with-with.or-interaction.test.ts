import type { BuilderMap } from "@/ast";
import type { ExtractCaptures } from "@/pattern";
import { assertType } from "@/test-utils/assert-type";

describe("NodeWithWith + Or interactions (type-level)", () => {
  it("allows composing .with after a union of matchers (bag gains required key)", () => {
    function check(U: BuilderMap) {
      const out = U.or(U.EmptyStatement(), U.EmptyStatement()).with(() => ({
        foo: "foo" as const,
      }));
      type Bag = ExtractCaptures<typeof out>;
      assertType<Bag, { foo: "foo" }>(0);
    }
    void check;
  });

  it("merges multiple .with calls on a single matcher (distinct keys)", () => {
    function check(U: BuilderMap) {
      const out = U.EmptyStatement()
        .with(() => ({ foo: "foo" as const }))
        .with(() => ({ bar: "bar" as const }));
      type Bag = ExtractCaptures<typeof out>;
      assertType<Bag, { foo: "foo"; bar: "bar" }>(0);
    }
    void check;
  });
});
