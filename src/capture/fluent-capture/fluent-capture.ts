import type { Capture } from "@/capture/capture-type";
import type { Spread } from "@/capture/spread/spread";
import type { DollarObjectSpread } from "@/capture/dollar-spread/dollar-spread";
import type { CaptureMods } from "@/capture/capture-mods/capture-mods";
import type {
  ModDefault,
  ModMap,
  ModTruthy,
  ModWhen,
} from "@/capture/capture-mods/capture-mods";
import type { NormalizeCaptured } from "@/ast/normalize-captured";
import type { TSESTree } from "@typescript-eslint/types";

export type CaptureBase<Name extends string, Value> = Capture<Name, Value> &
  Iterable<Spread<Name, Value>> &
  DollarObjectSpread;

/** Shared fluent ops for capture-like carriers. */
export type FluentOps<Self, Value> = {
  map<New>(fn: (value: Value) => New): Self &
    CaptureMods<ModMap<NormalizeCaptured<New>>>;
  default<Expr>(expr: Expr): Self &
    CaptureMods<ModDefault<NormalizeCaptured<Expr>>>;
  defaultUndefined(): Self & CaptureMods<ModDefault<TSESTree.Identifier>>;
  truthy(): Self & CaptureMods<ModTruthy>;
  when<Narrow extends Value>(
    guard: (value: Value) => value is Narrow
  ): Self & CaptureMods<ModWhen<Narrow>>;
  when(predicate: (value: Value) => boolean): Self;
};

export interface FluentCapture<Name extends string, Value>
  extends CaptureBase<Name, Value>,
    FluentOps<FluentCapture<Name, Value>, Value> {}
