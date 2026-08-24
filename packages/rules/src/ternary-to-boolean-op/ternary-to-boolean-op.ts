import { U, $ } from "@ts-unify/core";

/**
 * Whether an expression is boolean by shape: a comparison, a negation, a
 * logical of such, or a boolean literal. For any other test the ternary's
 * value may differ from the operator's (`x ? true : r` is `true` where
 * `x || r` is `x`), so only a boolean-shaped test is rewritten.
 */
const booleanShaped = (e: unknown): boolean => {
  if (e === null || typeof e !== "object") return false;
  const n = e as { type: string; operator?: string; left?: unknown; right?: unknown; argument?: unknown; value?: unknown };
  if (n.type === "BinaryExpression")
    return ["===", "!==", "==", "!=", "<", "<=", ">", ">=", "in", "instanceof"].includes(n.operator ?? "");
  if (n.type === "UnaryExpression") return n.operator === "!";
  if (n.type === "LogicalExpression")
    return (n.operator === "&&" || n.operator === "||") && booleanShaped(n.left) && booleanShaped(n.right);
  if (n.type === "Literal") return typeof n.value === "boolean";
  return false;
};

type Arm = { type: string; value?: unknown };

const isBool = (e: unknown, value: boolean): boolean =>
  typeof e === "object" && e !== null && (e as Arm).type === "Literal" && (e as Arm).value === value;

const isLiteral = (e: unknown): boolean =>
  typeof e === "object" && e !== null && (e as Arm).type === "Literal";

const FLIPPED: Record<string, string> = { "===": "!==", "!==": "===", "==": "!=", "!=": "==" };

/**
 * The negation of a boolean-shaped test: an equality flipped, anything else
 * under `!`.
 */
const negated = (test: unknown): unknown => {
  const n = test as { type: string; operator?: string; left?: unknown; right?: unknown };
  if (n.type === "BinaryExpression" && n.operator !== undefined && n.operator in FLIPPED)
    return U.BinaryExpression({ operator: FLIPPED[n.operator] as never, left: n.left as never, right: n.right as never });
  return U.UnaryExpression({ operator: "!", prefix: true, argument: test as never });
};

/**
 * The operator form a ternary with a boolean literal arm stands for, or
 * null when it has none: `c ? true : r` -> `c || r`, `c ? r : false` ->
 * `c && r`, `c ? false : r` -> `!c && r`, `c ? true : false` -> `c`,
 * `c ? false : true` -> `!c`.
 */
function form(bag: { test?: unknown; consequent?: unknown; alternate?: unknown }): unknown {
  const { test, consequent, alternate } = bag;
  if (!booleanShaped(test)) return null;
  if (isBool(consequent, true) && isBool(alternate, false)) return test;
  if (isBool(consequent, false) && isBool(alternate, true)) return negated(test);
  if (isBool(consequent, true))
    return U.LogicalExpression({ operator: "||", left: test as never, right: alternate as never });
  if (isBool(alternate, false) && !isLiteral(consequent))
    return U.LogicalExpression({ operator: "&&", left: test as never, right: consequent as never });
  if (isBool(consequent, false) && !isLiteral(alternate))
    return U.LogicalExpression({ operator: "&&", left: negated(test) as never, right: alternate as never });
  return null;
}

/**
 * A ternary with a boolean literal arm is a boolean operator: `c ? true : r`
 * is `c || r`, `c ? r : false` is `c && r`, `c ? false : r` is `!c && r`,
 * `c ? true : false` is `c`, `c ? false : true` is `!c` (an equality
 * flipped). Only when `c` is boolean by shape — a
 * comparison, a negation, a logical of those — since for any other value
 * the ternary and the operator differ in what they yield.
 *
 * @example
 * ```ts
 * // Before
 * x === 1 ? true : rest
 *
 * // After
 * x === 1 || rest
 * ```
 */
export const ternaryToBooleanOp = U.ConditionalExpression({
  test: $("test"),
  consequent: $("consequent"),
  alternate: $("alternate"),
})
  .when((bag) => form(bag) !== null)
  .to((bag) => form(bag))
  .message("A ternary with a boolean literal arm is a boolean operator");
