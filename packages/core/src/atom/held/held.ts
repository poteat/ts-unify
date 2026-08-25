/**
 * Every definition a store type holds, its parents' included, read off the
 * `holds` phantom; `never` for a type with none.
 *
 * @typeParam C the store's type, as narrowed at the call
 */
export type Held<C> = C extends { readonly holds?: infer H }
  ? NonNullable<H> extends (definition: infer F) => void
    ? F
    : never
  : never
