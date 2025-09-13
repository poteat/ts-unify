import type { Capture } from "../capture";
import type {
  Prettify,
  HasNever,
  KeysToTuple,
} from "../type-utils";

/**
 * Extracts the name from a Capture type
 * @internal
 */
type GetCaptureName<T> = T extends Capture<infer Name> ? Name : never;

/**
 * Work item for the TCO processing queue
 * @param O - Original type at this position
 * @param P - Pattern type at this position
 * @param Keys - For objects, remaining keys to process
 * @internal
 */
type Work<O = any, P = any, Keys extends readonly any[] = []> = {
  o: O;
  p: P;
  keys: Keys;
};

/**
 * Tail-recursive work processor
 * @internal
 */
type ProcessWorkTCO<Queue extends readonly any[], Acc = {}> = 0 extends 1
  ? never
  : Queue extends readonly []
  ? Acc
  : Queue extends readonly [infer Head, ...infer Tail]
  ? Head extends Work<infer O, infer P, infer Keys>
    ? P extends Capture<any>
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
                    Work<O, P, RestKeys>,
                    Work<O[Key], P[Key], KeysToTuple<P[Key]>>,
                    ...Tail
                  ],
                  Acc
                >
              : ProcessWorkTCO<[Work<O, P, RestKeys>, ...Tail], Acc>
            : ProcessWorkTCO<[Work<O, P, RestKeys>, ...Tail], Acc>
          : ProcessWorkTCO<Tail, Acc> // No more keys
        : ProcessWorkTCO<Tail, Acc>
      : ProcessWorkTCO<Tail, Acc>
    : ProcessWorkTCO<Tail, Acc>
  : never;

/**
 * Process a single work item by delegating to TCO implementation
 * @internal
 */
type ProcessWork<W> = W extends Work<infer O, infer P>
  ? P extends object
    ? ProcessWorkTCO<[Work<O, P, KeysToTuple<P>>]>
    : ProcessWorkTCO<[Work<O, P, []>]>
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
 * Same-named captures must have compatible types or returns `never`.
 *
 * @example
 * type Data = { user: { id: number; name: string } };
 * type Pattern = { user: { id: Capture<"userId">; name: Capture<"name"> } };
 * type Result = ExtractCaptures<Data, Pattern>;
 * //   ^? { userId: number; name: string }
 *
 * @typeParam Original - Source type to extract from
 * @typeParam Pattern - Pattern containing Capture sentinels
 */
export type ExtractCaptures<Original, Pattern> = ValidateExtraction<
  Prettify<ExtractCapturesImpl<[Work<Original, Pattern>]>>
>;
