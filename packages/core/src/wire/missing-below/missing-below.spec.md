# MissingBelow

`MissingBelow<C, P>` walks the dependencies `P` declares, and theirs, and
collects every provider the container type `C` does not accept. It is the
completeness check behind `Container.get`, where no tuple of registered
providers exists to hand `Missing`.

The third parameter carries the providers already visited, so a cycle in
the declared dependencies ends the walk rather than the type checker.
