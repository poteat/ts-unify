# Scoped

`Scoped<C, S>` is the rest parameter of `Store.scope`: `S` itself when no
definition in it fills a slot the parent type `C` fills (`Shadowed`), else
`readonly Refills<M>[]` with the slots filled twice in `M`, so the call
fails on its first argument with the slot named.
