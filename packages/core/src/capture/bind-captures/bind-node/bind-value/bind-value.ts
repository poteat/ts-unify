import type { IsAstNode } from '@/ast/is-ast-node'
import type { ApplyMods, ExtractMods } from '@/capture/bind-captures/mods'
import type { BindSequence, SpreadElem } from '@/capture/bind-captures/sequence'
import type { Capture } from '@/capture/capture-type'
import type { $ } from '@/capture/dollar'
import type { Spread } from '@/capture/spread'
import type { ConfigSlot } from '@/config/config-type'
import type { StringPredicate } from '@/string-predicate/string-predicate'

import type { BindObject } from './bind-object'
import type { BindPlaceholder } from './types'

/**
 * A pattern value bound against the shape at its position, by what it is.
 *
 * A placeholder, a config slot, an explicit capture, a spread, a sequence
 * and an object each bind their own way; a concrete AST node, a string
 * predicate, a RegExp and a primitive pass through unchanged.
 *
 * @typeParam P pattern value
 * @typeParam S shape at the value's position
 * @typeParam Key key of the position; empty at the root
 */
export type BindValue<P, S, Key extends string> =
  IsAstNode<P> extends true
    ? P
    : P extends StringPredicate | RegExp
      ? P
      : P extends $
        ? BindPlaceholder<P, S, Key>
        : P extends ConfigSlot<infer Name, infer V>
          ? ConfigSlot<Name & string, unknown extends V ? S : V>
          : P extends Capture<infer Name, infer V>
            ? Capture<
                Name & string,
                ApplyMods<unknown extends V ? S : V, ExtractMods<P>>
              >
            : P extends Spread<infer Name, infer Elem>
              ? S extends readonly unknown[]
                ? Spread<Name & string, SpreadElem<Elem, S>>
                : Spread<Name & string, Elem>
              : P extends readonly [...infer Items]
                ? BindSequence<Items, S, Key>
                : P extends object
                  ? BindObject<P, S>
                  : P
