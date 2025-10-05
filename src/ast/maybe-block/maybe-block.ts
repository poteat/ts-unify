import type { FluentNode } from "@/ast/fluent-node";
import type { UnwrapFluent } from "@/ast/unwrap-fluent";
import type { NodeByKind } from "@/ast/node-by-kind";
import type { WithoutInternalAstFields } from "@/type-utils";
import type { OR_BRAND } from "@/ast/or";

type BlockWithSingle<S> = {
  type: NodeByKind["BlockStatement"]["type"];
  body: Readonly<[S]>;
} & Omit<WithoutInternalAstFields<NodeByKind["BlockStatement"]>, "body">;

export type MaybeBlockCombinator = <S extends FluentNode<any>>(
  stmt: S
) => FluentNode<UnwrapFluent<S> | BlockWithSingle<UnwrapFluent<S>>> & {
  readonly [OR_BRAND]: true;
};

