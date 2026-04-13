/**
 * TS-aware astring generator. Extends astring's base generator so
 * captured TSESTree nodes (param type annotations, return types, etc.)
 * survive serialization instead of being silently dropped.
 */
import { generate, GENERATOR } from "astring";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type S = { write(s: string, node?: any): void };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type N = any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tsGenerator: Record<string, any> = {
  ...GENERATOR,

  Identifier(node: N, state: S) {
    state.write(node.name, node);
    if (node.typeAnnotation) this.TSTypeAnnotation(node.typeAnnotation, state);
  },

  ArrowFunctionExpression(node: N, state: S) {
    state.write(node.async ? "async " : "", node);
    const { params } = node;
    if (params != null) {
      if (params.length === 1 && params[0].type === "Identifier" && !params[0].typeAnnotation) {
        state.write(params[0].name, params[0]);
      } else {
        state.write("(");
        for (let i = 0; i < params.length; i++) {
          if (i > 0) state.write(", ");
          this[params[i].type](params[i], state);
        }
        state.write(")");
      }
    }
    if (node.returnType) this.TSTypeAnnotation(node.returnType, state);
    state.write(" => ");
    if (node.body.type === "ObjectExpression") {
      state.write("(");
      this.ObjectExpression(node.body, state);
      state.write(")");
    } else {
      this[node.body.type](node.body, state);
    }
  },

  TSTypeAnnotation(node: N, state: S) { state.write(": "); this[node.typeAnnotation.type](node.typeAnnotation, state); },
  TSStringKeyword(_n: N, state: S) { state.write("string"); },
  TSNumberKeyword(_n: N, state: S) { state.write("number"); },
  TSBooleanKeyword(_n: N, state: S) { state.write("boolean"); },
  TSVoidKeyword(_n: N, state: S) { state.write("void"); },
  TSAnyKeyword(_n: N, state: S) { state.write("any"); },
  TSUnknownKeyword(_n: N, state: S) { state.write("unknown"); },
  TSNeverKeyword(_n: N, state: S) { state.write("never"); },
  TSNullKeyword(_n: N, state: S) { state.write("null"); },
  TSUndefinedKeyword(_n: N, state: S) { state.write("undefined"); },
  TSBigIntKeyword(_n: N, state: S) { state.write("bigint"); },
  TSSymbolKeyword(_n: N, state: S) { state.write("symbol"); },
  TSObjectKeyword(_n: N, state: S) { state.write("object"); },

  TSTypeReference(node: N, state: S) {
    this[node.typeName.type](node.typeName, state);
    const args = node.typeArguments ?? node.typeParameters;
    if (args) {
      state.write("<");
      for (let i = 0; i < args.params.length; i++) {
        if (i > 0) state.write(", ");
        this[args.params[i].type](args.params[i], state);
      }
      state.write(">");
    }
  },

  TSQualifiedName(node: N, state: S) { this[node.left.type](node.left, state); state.write("."); state.write(node.right.name); },
  TSUnionType(node: N, state: S) { for (let i = 0; i < node.types.length; i++) { if (i > 0) state.write(" | "); this[node.types[i].type](node.types[i], state); } },
  TSIntersectionType(node: N, state: S) { for (let i = 0; i < node.types.length; i++) { if (i > 0) state.write(" & "); this[node.types[i].type](node.types[i], state); } },
  TSArrayType(node: N, state: S) { this[node.elementType.type](node.elementType, state); state.write("[]"); },
  TSTupleType(node: N, state: S) { state.write("["); for (let i = 0; i < node.elementTypes.length; i++) { if (i > 0) state.write(", "); this[node.elementTypes[i].type](node.elementTypes[i], state); } state.write("]"); },
  TSLiteralType(node: N, state: S) { if (node.literal.type === "Literal") { this.Literal(node.literal, state); } else { this[node.literal.type](node.literal, state); } },
  TSTypeLiteral(node: N, state: S) { state.write("{ "); for (let i = 0; i < node.members.length; i++) { if (i > 0) state.write("; "); this[node.members[i].type](node.members[i], state); } state.write(" }"); },
  TSPropertySignature(node: N, state: S) { if (node.readonly) state.write("readonly "); this[node.key.type](node.key, state); if (node.optional) state.write("?"); if (node.typeAnnotation) this.TSTypeAnnotation(node.typeAnnotation, state); },
  TSFunctionType(node: N, state: S) { state.write("("); if (node.params) { for (let i = 0; i < node.params.length; i++) { if (i > 0) state.write(", "); this[node.params[i].type](node.params[i], state); } } state.write(")"); const ret = node.returnType ?? node.typeAnnotation; if (ret) { state.write(" => "); if (ret.type === "TSTypeAnnotation") { this[ret.typeAnnotation.type](ret.typeAnnotation, state); } else { this[ret.type](ret, state); } } },
  TSParenthesizedType(node: N, state: S) { state.write("("); this[node.typeAnnotation.type](node.typeAnnotation, state); state.write(")"); },
  TSTypeQuery(node: N, state: S) { state.write("typeof "); this[node.exprName.type](node.exprName, state); },
  TSAsExpression(node: N, state: S) { this[node.expression.type](node.expression, state); state.write(" as "); this[node.typeAnnotation.type](node.typeAnnotation, state); },
};

/** Generate JS/TS source from an ESTree/TSESTree node. */
export function tsGenerate(node: unknown): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return generate(node as Parameters<typeof generate>[0], { generator: tsGenerator as any });
}
