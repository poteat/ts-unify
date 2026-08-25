# Accepted

`Accepted<C, S>` is the parameter type of `Store.get`: `S` when the store
type `C` fills `S` and every slot reachable from its definition's deps,
`MissingDeps<M>` naming the slots still missing, or `Unfilled<S>` when `C`
does not fill `S` at all.
