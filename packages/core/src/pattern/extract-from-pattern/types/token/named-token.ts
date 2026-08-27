/**
 * What `Capture` and `ConfigSlot` share once their brands are set aside:
 * a `name` and a phantom `value` producer, all a bag builder reads.
 */
export type NamedToken<Name extends string, Value> = {
  readonly name: Name

  /**
   * Phantom producer of the value: it carries `Value` for the type level
   * and no token holds one at runtime.
   */
  readonly value?: () => Value
}
