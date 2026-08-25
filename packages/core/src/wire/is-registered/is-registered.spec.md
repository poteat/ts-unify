# IsRegistered

`IsRegistered<C, P>` reads a container type's `accepts` phantom, a function
taking the registered providers, and asks whether it takes `P`.

On an intersection of container types the phantom is an overload set and
any overload may take `P`; on a union the check distributes and every
branch must. That is what makes a binding narrowed by several `register`
assertions, and one narrowed under a condition, read correctly.
