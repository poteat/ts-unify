import type { Capture } from "@/capture/capture-type";
import type { Spread } from "@/capture/spread/spread";
import type { DollarObjectSpread } from "@/capture/dollar-spread/dollar-spread";
import type { CaptureWithMap } from "@/capture/capture-with-map";
import type { CaptureWithDefault } from "@/capture/capture-with-default";
import type { CaptureWithDefaultUndefined } from "@/capture/capture-with-default-undefined";
import type { CaptureWithTruthy } from "@/capture/capture-with-truthy";
import type { CaptureWithWhen } from "@/capture/capture-with-when";

export type CaptureBase<Name extends string, Value> = Capture<Name, Value> &
  Iterable<Spread<Name, Value>> &
  DollarObjectSpread;

export type FluentCapture<Name extends string, Value> = CaptureBase<
  Name,
  Value
> &
  CaptureWithMap<Name, Value> &
  CaptureWithDefault<Name, Value> &
  CaptureWithDefaultUndefined<Name, Value> &
  CaptureWithTruthy<Name, Value> &
  CaptureWithWhen<Name, Value>;
