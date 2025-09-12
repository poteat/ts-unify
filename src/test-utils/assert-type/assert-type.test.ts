import { assertType } from "./assert-type";

describe("assertType", () => {
  test("exact type matches compile", () => {
    // Primitives
    assertType<string, string>(0);
    assertType<number, number>(0);
    assertType<boolean, boolean>(0);

    // Literals
    assertType<"hello", "hello">(0);
    assertType<42, 42>(0);
    assertType<true, true>(0);

    // Objects
    assertType<{ a: string }, { a: string }>(0);
    assertType<{ a: { b: number } }, { a: { b: number } }>(0);

    // Arrays and tuples
    assertType<string[], string[]>(0);
    assertType<[string, number], [string, number]>(0);

    // Functions
    assertType<(a: string) => void, (a: string) => void>(0);

    // Special types
    assertType<any, any>(0);
    assertType<unknown, unknown>(0);
    assertType<never, never>(0);
    assertType<void, void>(0);
    assertType<undefined, undefined>(0);
    assertType<null, null>(0);

    expect(true).toBe(true);
  });

  test("type mismatches cause compile errors", () => {
    // Different primitives
    // @ts-expect-error - string is not number
    assertType<string, number>(0);
    
    // Literal vs base type
    // @ts-expect-error - literal "hello" is not string
    assertType<"hello", string>(0);
    
    // Different object shapes
    // @ts-expect-error - objects have different properties
    assertType<{ a: string }, { a: string; b: number }>(0);
    
    // Union vs single type
    // @ts-expect-error - union is not single type
    assertType<string | number, string>(0);
    
    // Subtype relationships
    // @ts-expect-error - 42 is subtype of number, not equal
    assertType<42, number>(0);
    
    // Optional vs required
    // @ts-expect-error - optional is not the same as required
    assertType<{ a?: string }, { a: string }>(0);
    
    // Readonly modifier
    // @ts-expect-error - readonly is not the same as mutable
    assertType<{ readonly a: string }, { a: string }>(0);
    
    expect(true).toBe(true);
  });

  test("runtime behavior is no-op", () => {
    const result = assertType<string, string>(0);
    expect(result).toBe(0);

    // Function just returns its argument
    const input = 0;
    const output = assertType<number, number>(input);
    expect(output).toBe(input);
  });

  test("works with generic types", () => {
    type Container<T> = { value: T };

    assertType<Container<string>, Container<string>>(0);
    assertType<Container<number>, Container<number>>(0);

    // Generic with multiple parameters
    type Pair<A, B> = [A, B];
    assertType<Pair<string, number>, Pair<string, number>>(0);

    expect(true).toBe(true);
  });

  test("works with complex nested types", () => {
    type ComplexType = {
      user: {
        id: number;
        profile: {
          name: string;
          tags: string[];
        };
      };
      settings: Record<string, boolean>;
    };

    assertType<ComplexType, ComplexType>(0);

    expect(true).toBe(true);
  });
});
