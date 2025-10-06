import type { FluentCapture } from "@/capture/fluent-capture";
import type { CaptureMods } from "@/capture/capture-mods/capture-mods";
import type { ModTruthy } from "@/capture/capture-mods/capture-mods";

export type CaptureWithTruthyReturn<
  Name extends string,
  Value
> = FluentCapture<Name, Value> & CaptureMods<ModTruthy>;

export type CaptureWithTruthy<Name extends string, Value> = {
  truthy(): CaptureWithTruthyReturn<Name, Value>;
};
