# ValueOf

`ValueOf<A>` is the value type an `Atom` alias carries: `{ readonly now:
number }` for `Clock`, `string` for `CacheDir`; `never` for anything that
is not an atom type. It is what a definition's read returns, what `Of`
maps each dep to, and what `Store.get` hands back. The name is inferred
along with the value and dropped, since `Atom` is invariant in both.
