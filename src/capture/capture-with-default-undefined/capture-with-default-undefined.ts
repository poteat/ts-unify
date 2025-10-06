import type { TSESTree } from "@typescript-eslint/types";
import type { FluentCapture } from "@/capture/fluent-capture";
import type { CaptureMods } from "@/capture/capture-mods/capture-mods";
import type { ModDefault } from "@/capture/capture-mods/capture-mods";

export type CaptureWithDefaultUndefinedReturn<
  Name extends string,
  Value
> = FluentCapture<Name, Value> & CaptureMods<ModDefault<TSESTree.Identifier>>;

export type CaptureWithDefaultUndefined<Name extends string, Value = unknown> = {
  defaultUndefined(): CaptureWithDefaultUndefinedReturn<Name, Value>;
};
