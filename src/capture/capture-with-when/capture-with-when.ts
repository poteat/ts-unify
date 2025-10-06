import type { FluentCapture } from "@/capture/fluent-capture";
import type { CaptureMods } from "@/capture/capture-mods/capture-mods";
import type { ModWhen } from "@/capture/capture-mods/capture-mods";

export type CaptureWithWhenReturn<
  Name extends string,
  Value,
  Narrow
> = FluentCapture<Name, Value> & CaptureMods<ModWhen<Narrow>>;

export type CaptureWithWhen<Name extends string, Value> = {
  when<Narrow extends Value>(
    guard: (value: Value) => value is Narrow
  ): CaptureWithWhenReturn<Name, Value, Narrow>;

  when(predicate: (value: Value) => boolean): CaptureWithWhenReturn<
    Name,
    Value,
    Value
  >;
};
