import type { Capture } from "../capture";
import type { $ } from "../capture";
import type { Prettify, HasNever, KeysToTuple } from "../type-utils";

/**
 * Checks if a type is the $ function itself (for implicit captures)
 * @internal
 */
type IsDollarFunction<T> = T extends typeof $ ? true : false;

/**
 * Extracts the name from a Capture type
 * @internal
 */
type GetCaptureName<T> = T extends Capture<infer Name> ? Name : never;

/**
 * Work item for the TCO processing queue with key context
 * @param O - Original type at this position
 * @param P - Pattern type at this position
 * @param Key - Current key name for implicit captures
 * @param Keys - For objects, remaining keys to process
 * @internal
 */
type Work<O = any, P = any, Key extends string = "", Keys extends readonly any[] = []> = {
  o: O;
  p: P;
  key: Key;
  keys: Keys;
};

/**
 * Tail-recursive work processor with implicit capture support
 * @internal
 */
type ProcessWorkTCO<Queue extends readonly any[], Acc = {}> = 0 extends 1
  ? never
  : Queue extends readonly []
  ? Acc
  : Queue extends readonly [infer Head, ...infer Tail]
  ? Head extends Work<infer O, infer P, infer CurrentKey, infer Keys>
    ? IsDollarFunction<P> extends true
      ? CurrentKey extends ""
        ? // Root-level $ - capture all keys of O
          O extends object
          ? ProcessWorkTCO<Tail, Acc & O>
          : ProcessWorkTCO<Tail, Acc>
        : // Nested $ - use current key as capture name
          ProcessWorkTCO<Tail, Acc & { [K in CurrentKey]: O }>
      : P extends Capture<any>
      ? ProcessWorkTCO<Tail, Acc & { [K in GetCaptureName<P>]: O }>
      : P extends readonly [...infer PItems]
      ? O extends readonly any[]
        ? ProcessWorkTCO<
            [
              ...Tail,
              ...{
                [K in keyof PItems]: Work<
                  K extends keyof O ? O[K] : O[number],
                  PItems[K],
                  `${K & string}`,  // Array index as key
                  []
                >;
              }
            ],
            Acc
          >
        : ProcessWorkTCO<Tail, Acc>
      : P extends object
      ? O extends object
        ? Keys extends readonly [infer Key, ...infer RestKeys]
          ? Key extends keyof P
            ? Key extends keyof O
              ? // Process one object key, queue rest
                ProcessWorkTCO<
                  [
                    Work<O, P, CurrentKey, RestKeys>,
                    Work<O[Key], P[Key], Key & string, KeysToTuple<P[Key]>>,
                    ...Tail
                  ],
                  Acc
                >
              : ProcessWorkTCO<[Work<O, P, CurrentKey, RestKeys>, ...Tail], Acc>
            : ProcessWorkTCO<[Work<O, P, CurrentKey, RestKeys>, ...Tail], Acc>
          : ProcessWorkTCO<Tail, Acc> // No more keys
        : ProcessWorkTCO<Tail, Acc>
      : ProcessWorkTCO<Tail, Acc>
    : ProcessWorkTCO<Tail, Acc>
  : never;

/**
 * Process a single work item by delegating to TCO implementation
 * @internal
 */
type ProcessWork<W> = W extends Work<infer O, infer P, infer Key>
  ? P extends object
    ? ProcessWorkTCO<[Work<O, P, Key, KeysToTuple<P>>]>
    : ProcessWorkTCO<[Work<O, P, Key, []>]>
  : {};

/**
 * Main TCO implementation - processes top-level work items
 * @internal
 */
type ExtractCapturesImpl<
  Queue extends readonly any[],
  Acc = {}
> = Queue extends readonly []
  ? Acc
  : Queue extends readonly [infer Head, ...infer Tail]
  ? ExtractCapturesImpl<Tail, Acc & ProcessWork<Head>>
  : never;

/**
 * Validates that extraction succeeded (no never types in captures)
 * Returns never if any capture resulted in an unmatchable type
 * @internal
 */
type ValidateExtraction<T> = T extends Record<string, any>
  ? {
      [K in keyof T]: HasNever<T[K]> extends true ? never : T[K];
    } extends T
    ? T
    : never
  : T;

/**
 * Extracts typed capture bindings from a pattern matched against a type.
 * Supports both explicit captures and implicit captures using $ function.
 * Same-named captures must have compatible types or returns `never`.
 *
 * @example
 * // Explicit captures
 * type Data = { user: { id: number; name: string } };
 * type Pattern = { user: { id: Capture<"userId">; name: Capture<"name"> } };
 * type Result = ExtractCaptures<Data, Pattern>;
 * //   ^? { userId: number; name: string }
 * 
 * // Implicit captures using $
 * type Pattern2 = { user: { id: typeof $; name: typeof $ } };
 * type Result2 = ExtractCaptures<Data, Pattern2>;
 * //   ^? { id: number; name: string }
 *
 * @typeParam Original - Source type to extract from
 * @typeParam Pattern - Pattern containing Capture sentinels or $ function
 */
export type ExtractCaptures<Original, Pattern> = ValidateExtraction<
  Prettify<ExtractCapturesImpl<[Work<Original, Pattern, "">]>>
>;
