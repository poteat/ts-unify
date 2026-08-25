# Provider

The type every provider satisfies:
`(need: Get<readonly Provider[]>) => unknown`.

A provider is a function. Its parameter's type is where it declares its
dependencies (see `Get`); its return type is what `Container.get` returns for it. A
provider with no dependencies may take no parameter at all.

`Provider` and `Get` refer to each other: a provider takes a getter of
providers. A user never names `Provider` on a provider, since the
annotation would widen the declared dependencies to every provider and
leave `Missing` unable to find it complete.
