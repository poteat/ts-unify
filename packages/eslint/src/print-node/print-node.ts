import { print } from "recast";

/** Keys that are not children: skipped when copying a node for printing. */
const NON_CHILD_KEYS = new Set(["parent", "loc", "range", "tokens", "comments"]);

/** Kinds where recast already reads `typeArguments` and would print both. */
const READS_TYPE_ARGUMENTS = new Set(["CallExpression", "OptionalCallExpression", "NewExpression"]);

/** TS expression kinds recast prints without the parentheses their position needs. */
const NEEDS_PARENS_AS_OPERAND = new Set(["TSAsExpression", "TSSatisfiesExpression", "TSTypeAssertion"]);

/** Node keys under which an operand of those kinds must be parenthesized. */
const OPERAND_KEYS: Record<string, readonly string[]> = {
  MemberExpression: ["object"],
  CallExpression: ["callee"],
  NewExpression: ["callee"],
  TaggedTemplateExpression: ["tag"],
  ChainExpression: [],
};

/** Type kinds that need parentheses as an array's element or an operator's operand. */
const COMPOUND_TYPES = new Set([
  "TSUnionType",
  "TSIntersectionType",
  "TSFunctionType",
  "TSConstructorType",
  "TSConditionalType",
  "TSTypeOperator",
  "TSInferType",
]);

/** TS signature kinds whose return annotation recast reads as `typeAnnotation`. */
const RETURN_AS_TYPE_ANNOTATION = new Set([
  "TSFunctionType",
  "TSConstructorType",
  "TSCallSignatureDeclaration",
  "TSConstructSignatureDeclaration",
  "TSMethodSignature",
]);

/**
 * Copy a typescript-estree tree into the shape recast prints. recast's TS
 * printer predates typescript-estree v8: it reads `typeParameters` where v8
 * has `typeArguments`, and on signature types it reads `typeAnnotation`
 * where v8 has `returnType`. The copy carries both names so either reader
 * works; the input is left untouched. A RegExp (a Literal's `value`) is a
 * value, not a node, and passes through whole. An `as`/`satisfies`/`<T>`
 * expression standing as a member's object or a call's callee is marked
 * parenthesized, which recast omits and the grammar requires; so is a
 * union, intersection, function or conditional type as an array's element
 * or a `keyof`/`readonly` operand (`(string | undefined)[]`).
 */
function toRecastShape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(toRecastShape);
  if (value === null || typeof value !== "object" || value instanceof RegExp) return value;
  const node = value as Record<string, unknown>;
  const copy: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(node)) {
    if (NON_CHILD_KEYS.has(k)) continue;
    copy[k] = toRecastShape(v);
  }
  if (
    copy.typeArguments !== undefined &&
    copy.typeParameters === undefined &&
    !READS_TYPE_ARGUMENTS.has(copy.type as string)
  ) {
    copy.typeParameters = copy.typeArguments;
  }
  if (copy.type === "TSArrayType" || copy.type === "TSTypeOperator") {
    const key = copy.type === "TSArrayType" ? "elementType" : "typeAnnotation";
    const inner = copy[key] as Record<string, unknown> | undefined;
    if (inner && COMPOUND_TYPES.has(inner.type as string)) {
      copy[key] = { type: "TSParenthesizedType", typeAnnotation: inner };
    }
  }
  for (const key of OPERAND_KEYS[copy.type as string] ?? []) {
    const operand = copy[key] as Record<string, unknown> | undefined;
    if (operand && NEEDS_PARENS_AS_OPERAND.has(operand.type as string)) {
      operand.extra = { ...(operand.extra as object | undefined), parenthesized: true };
    }
  }
  if (
    typeof copy.type === "string" &&
    RETURN_AS_TYPE_ANNOTATION.has(copy.type) &&
    copy.returnType !== undefined &&
    copy.typeAnnotation === undefined
  ) {
    copy.typeAnnotation = copy.returnType;
  }
  return copy;
}

/** Print an ESTree node (typescript-estree v8 shape) to source text via recast. */
export function printNode(node: unknown): string {
  return print(toRecastShape(node) as Parameters<typeof print>[0]).code;
}
