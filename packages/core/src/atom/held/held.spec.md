# Held

`Held<C>` is the union of definitions a store type `C` holds, its parents'
included, read off the `holds` phantom's parameter; `never` for a type
with no such phantom. Over a union of store types it distributes, so the
walk in `MissingBelow` sees every branch's definitions.
