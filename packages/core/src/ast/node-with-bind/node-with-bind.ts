import type { FluentNode } from "@/ast/fluent-node";
import type { NormalizeCaptured } from "@/ast/normalize-captured";
import type { Sealed } from "@/ast/sealed";
import type { SubstituteCaptures } from "@/ast/substitute-captures";

/**
 * Add a fluent `.bind` which captures an entire subtree under a particular
 * name. Regardless of overload, the existing capture bag is cleared and
 * replaced with a single whole-tree capture.
 */
export type NodeWithBind<Node> = Node & {
  /**
   * Capture the whole subtree under the provided `name`. Clears any existing
   * capture entries contributed by the node while keeping the node unsealed.
   */
  bind<const S extends string>(
    name: S
  ): FluentNode<BindExclusive<Node, S>>;

  /**
   * Zero-arg sugar: capture the whole subtree under the canonical `"node"`
   * name, seal the subtree, and clear the capture bag.
   */
  bind(): FluentNode<Sealed<BindExclusive<Node, "node">>>;
};

type BindBagEntries<Node, Name extends string> = {
  [K in Name]: NormalizeCaptured<Node>;
};

type BindExclusive<Node, Name extends string> = SubstituteCaptures<
  Omit<Node, "__with" | "__only">,
  BindBagEntries<Node, Name>
> & {
  readonly __only: BindBagEntries<Node, Name>;
};
