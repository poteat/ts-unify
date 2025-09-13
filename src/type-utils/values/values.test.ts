import { assertType } from "../../test-utils/assert-type";
import type { Values } from "./values";

describe("Values type utility", () => {
  it("should extract values from basic objects", () => {
    type TestObj = { a: string; b: number; c: boolean };
    type Result = Values<TestObj>;
    assertType<Result, string | number | boolean>(0);
  });

  it("should return never for empty objects", () => {
    type Empty = {};
    type Result = Values<Empty>;
    assertType<Result, never>(0);
  });

  it("should handle objects with same value types", () => {
    type AllStrings = { name: string; description: string; id: string };
    type Result = Values<AllStrings>;
    assertType<Result, string>(0);
  });

  it("should include undefined for optional properties", () => {
    type WithOptional = { required: string; optional?: number };
    type Result = Values<WithOptional>;
    assertType<Result, string | number | undefined>(0);
  });

  it("should extract nested object types", () => {
    type Nested = {
      user: { name: string; age: number };
      settings: { theme: string; darkMode: boolean };
    };
    type Result = Values<Nested>;
    assertType<
      Result,
      { name: string; age: number } | { theme: string; darkMode: boolean }
    >(0);
  });

  it("should work with index signatures", () => {
    type StringRecord = { [key: string]: number };
    type Result = Values<StringRecord>;
    assertType<Result, number>(0);
  });

  it("should handle index signatures with specific properties", () => {
    type IndexWithSpecific = {
      [key: string]: string | number | boolean;
      specific: boolean;
    };
    type Result = Values<IndexWithSpecific>;
    assertType<Result, string | number | boolean>(0);
  });

  it("should work with readonly properties", () => {
    type ReadonlyObj = {
      readonly a: string;
      readonly b: number;
    };
    type Result = Values<ReadonlyObj>;
    assertType<Result, string | number>(0);
  });

  it("should handle union types in values", () => {
    type UnionValues = {
      status: "active" | "inactive";
      count: number | null;
    };
    type Result = Values<UnionValues>;
    assertType<Result, "active" | "inactive" | number | null>(0);
  });

  it("should work with discriminated unions", () => {
    type DiscriminatedUnion = {
      success: { type: "success"; data: string };
      error: { type: "error"; message: string };
    };
    type Result = Values<DiscriminatedUnion>;
    assertType<
      Result,
      { type: "success"; data: string } | { type: "error"; message: string }
    >(0);
  });

  it("should extract all properties from arrays (not just elements)", () => {
    // Note: Arrays have many properties beyond just indexed elements
    // Values<T[]> includes array methods, length, etc.
    type StringArray = string[];
    type Result = Values<StringArray>;

    // Result includes string (elements) but also array properties
    // Verify strings are assignable to Result
    void ((): Result => "test");

    // For practical element extraction, users should use T[number]
  });

  it("should extract all properties from tuples", () => {
    // Tuples also have array properties
    type Tuple = [string, number, boolean];
    type Result = Values<Tuple>;

    // Verify tuple elements are assignable to Result
    void ((): Result => "test");
    void ((): Result => 42);
    void ((): Result => true);

    // But Result also includes array properties like length, methods, etc.
  });
});
