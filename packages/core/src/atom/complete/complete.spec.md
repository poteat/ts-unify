# Complete

## Overview

`Complete<R>` is the rest parameter of `createStore`: `R` itself when
`Missing<R>` is `never`, else `readonly MissingDeps<Missing<R>>[]`, so the
call fails on its first argument with the missing slot named:

```
Argument of type 'Definition<Clock, NoDeps>' is not assignable to
parameter of type 'MissingDeps<Atom<Settings>>'.
```

`R` is still inferred from the arguments, so the binding keeps its type
and a later `get` reports the same slot as missing under the one asked
for.
