# MissingDeps

`MissingDeps<M>` is `{ readonly missing: M }`: the type a parameter
collapses to when a declared dependency is not registered. It is never a
value; it is there so the compile error names the provider types in `M`
instead of saying `never`.
