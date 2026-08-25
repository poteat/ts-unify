# IsFilled

`IsFilled<C, S>` is `true` when the `accepts` phantom of the store type
`C` takes the slot `S`. The phantom is a function over the filled slots, a
contravariant position, so a store that fills more accepts more; over a
union of store types the check distributes to `boolean` unless every
branch fills `S`, which is what a conditional `add` needs.
