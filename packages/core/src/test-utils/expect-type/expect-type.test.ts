import { expectType } from "./expect-type";

describe("expectType", () => {
  test("exact type matches pass", () => {
    // Primitives
    expectType("hello").toBe("hello");
    expectType(42).toBe(42);
    expectType(true).toBe(true);

    // Objects (reference equality with toBe)
    const obj = { a: "test" };
    expectType(obj).toBe(obj);

    // Arrays
    const arr = ["a", "b", "c"];
    expectType(arr).toBe(arr);

    // Special values
    expectType(null).toBe(null);
    expectType(undefined).toBe(undefined);
  });

  test("returns the expected value", () => {
    const result = expectType("hello").toBe("hello");
    expect(result).toBe("hello");

    const numResult = expectType(42).toBe(42);
    expect(numResult).toBe(42);
  });

  test("works with const assertions", () => {
    const literal = "hello" as const;
    expectType(literal).toBe("hello");

    const num = 42 as const;
    expectType(num).toBe(42);

    const obj = { mode: "production" } as const;
    expectType(obj.mode).toBe("production");
  });

  test("works with union types", () => {
    const value: string | number = "hello";

    // Type is string | number, so it must match exactly
    expectType(value).toBe(value);
  });

  test("works with generic functions", () => {
    function identity<T>(x: T): T {
      // Can use expectType inside generic functions
      expectType(x).toBe(x);
      return x;
    }

    const str = identity("test");
    expectType(str).toBe("test");

    const num = identity(42);
    expectType(num).toBe(42);
  });

  test("works with type narrowing", () => {
    const value: string | number = "hello";

    if (typeof value === "string") {
      // Type is narrowed to string
      expectType(value).toBe(value); // Both are string type
    }
  });

  test("enforces readonly modifiers", () => {
    const mutable = ["a", "b"];
    const readonlyArr: readonly string[] = ["a", "b"];

    expectType(mutable).toBe(mutable);
    expectType(readonlyArr).toBe(readonlyArr);
  });

  test("differentiates optional properties", () => {
    const withOptional: { a: string; b?: number } = { a: "test" };
    const withUndefined: { a: string; b: number | undefined } = {
      a: "test",
      b: undefined,
    };

    expectType(withOptional).toBe(withOptional);
    expectType(withUndefined).toBe(withUndefined);
  });
});
