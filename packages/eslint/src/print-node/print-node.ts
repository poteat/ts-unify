import { print } from "recast";

/** Keys that are not children: skipped when copying a node for printing. */
const NON_CHILD_KEYS = new Set(["parent", "loc", "range", "tokens", "comments"]);

/** Kinds where recast already reads `typeArguments` and would print both. */
const READS_TYPE_ARGUMENTS = new Set(["CallExpression", "OptionalCallExpression", "NewExpression"]);

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
 * works; the input is left untouched.
 */
function toRecastShape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(toRecastShape);
  if (value === null || typeof value !== "object") return value;
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
