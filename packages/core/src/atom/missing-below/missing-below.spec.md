# MissingBelow

`MissingBelow<C, S>` finds the definition of `S` among those the store type
`C` holds (`Defining`, off the `holds` phantom), walks the slots it reads
and theirs, and collects every one `C` does not fill (`Lacking`, off the
`accepts` phantom). It is the completeness check behind `Store.get`, where
no tuple of definitions exists to hand `Missing`.

The third parameter carries the slots already visited, so a cycle in the
deps ends the walk rather than the type checker.
