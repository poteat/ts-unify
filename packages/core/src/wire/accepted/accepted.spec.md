# Accepted

`Accepted<C, P>` is the parameter type of `Container.get`: `P` when `C`
accepts it and `MissingBelow<C, P>` is `never`; otherwise `Unregistered<P>`
or `MissingDeps<MissingBelow<C, P>>`, so the argument fails to type-check
with the provider, or the providers it still needs, named.
