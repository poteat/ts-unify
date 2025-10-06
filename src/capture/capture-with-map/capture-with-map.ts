import type { NormalizeCaptured } from "@/ast/normalize-captured";
import type { FluentCapture } from "@/capture/fluent-capture";
import type { CaptureMods } from "@/capture/capture-mods/capture-mods";
import type { ModMap } from "@/capture/capture-mods/capture-mods";

export type CaptureWithMapReturn<
  Name extends string,
  Value,
  New
> = FluentCapture<Name, Value> & CaptureMods<ModMap<New>>;

export type CaptureWithMap<Name extends string, Value> = {
  map<New>(fn: (value: Value) => New): CaptureWithMapReturn<
    Name,
    Value,
    NormalizeCaptured<New>
  >;
};
