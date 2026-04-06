import { U, $ } from "@ts-unify/core";

const flipOp = { "!==": "===", "!=": "==" } as const;

const negatedTernary = U.ConditionalExpression({
  test: U.UnaryExpression({ operator: "!", argument: $("condition") }),
  ...$,
});

const inequalityTernary = U.ConditionalExpression({
  test: U.BinaryExpression($),
  ...$,
}).when(({ operator }) => operator in flipOp);

/**
 * Normalize ternary expressions to have positive conditions first
 *
 * @example
 * ```ts
 * // Before
 * !condition ? consequent : alternate
 *
 * // After
 * condition ? alternate : consequent
 * ```
 *
 * @example
 * ```ts
 * // Before
 * x !== y ? consequent : alternate
 *
 * // After
 * x === y ? alternate : consequent
 * ```
 *
 * @example
 * ```ts
 * // Before
 * x != y ? consequent : alternate
 *
 * // After
 * x == y ? alternate : consequent
 * ```
 */

export const normalizeTernaryOrder = U.or(negatedTernary, inequalityTernary)
  .with(({ consequent: alternate, alternate: consequent }) => ({
    consequent,
    alternate,
  }))
  .with((bag) => ({
    test: bag.condition
      ? bag.condition
      : U.BinaryExpression({
          operator: flipOp[bag.operator as keyof typeof flipOp] ?? bag.operator,
          left: bag.left,
          right: bag.right,
        }),
  }))
  .to((bag) => U.ConditionalExpression(bag))
  .message("Normalize ternary to use positive condition")
  .recommended();
