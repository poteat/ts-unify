import type { NormalizeCaptured } from "@/ast/normalize-captured";
import type { FluentCapture } from "@/capture/fluent-capture";
import type { CaptureMods } from "@/capture/capture-mods/capture-mods";
import type { ModDefault } from "@/capture/capture-mods/capture-mods";

export type CaptureWithDefaultReturn<
  Name extends string,
  Value,
  Expr
> = FluentCapture<Name, Value> & CaptureMods<ModDefault<Expr>>;

export type CaptureWithDefault<Name extends string, Value = unknown> = {
  default<Expr>(expr: Expr): CaptureWithDefaultReturn<
    Name,
    Value,
    NormalizeCaptured<Expr>
  >;
};
