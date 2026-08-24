# String predicates

## Overview

A string position in a pattern accepts, besides a literal or a capture, a
string predicate: a branded function that tests the string and captures
nothing. The same function is callable on a captured value. `U.string` holds
the predicates: `regex(re)`, `reserved(options?)`, `identifierName()`, and
`not(p)`. A bare `RegExp` in a string position is sugar for
`U.string.regex(re)`.

## Scope

- Provider of the `StringPredicate` type, the `stringPredicate` brand, the
  `isStringPredicate` guard, `testString`, and the `U.string` members.
- `Pattern`, `BindCaptures` and `ExtractCaptures` admit a predicate (or a
  `RegExp`) in string positions and leave it unbound; the engine's match
  calls `testString`.
- The reserved-word table is generated, not written: `reserved-words.ts` is
  emitted by `scripts/gen-reserved-words.mjs` from the installed TypeScript's
  keyword table, and `reserved.test.ts` fails when the two differ.

## Design

- One mechanism. Every predicate value is recognised by `isStringPredicate`
  and applied by `testString`; a new test is a new `stringPredicate` call,
  never a new branch in the matcher or the types.
- One spelling. A predicate is a function of `unknown` returning `boolean`,
  `false` for a non-string, so the slot form `{ name: U.string.reserved() }`
  and the call form `U.string.reserved()(key)` are the same value. A capture
  bag over a `U.or` may carry a non-string (`Literal.value`), and the call
  form answers `false` for it without a `typeof` first.
- A brand, because a pattern may hold a plain function in other positions
  (guards, factories); a bare function in a string slot is not a test.
- The predicate belongs on the captured value when the slot sits under a
  `U.or`: one `.when` on the `or` runs once over whichever branch bound the
  capture. A predicate in the slot would be written into every branch, and
  would not keep the value. Written as a guard, the `.when` also narrows the
  capture to `string` where the `or` is embedded.
- In a slot, a predicate works because a bare `RegExp` already does: the
  matcher asks `isStringPredicate` and calls `testString`, for both. There is
  no second mechanism.
- `reserved` takes TypeScript's own table, `ts.textToKeywordObj` sliced by
  the scanner's `SyntaxKind` ranges, so it tracks the language without a
  hand-kept list. `identifierName` is one regular expression over
  `\p{ID_Start}` and `\p{ID_Continue}`, which the engine keeps current with
  Unicode.

## Semantics

- `testString(p, v)` and `p(v)` are `false` for any non-string `v`.
- `regex(re)` resets `re.lastIndex` before `test`, so a global or sticky
  flag does not make the second match differ from the first.
- `not(p)` is `true` exactly when `p` is `false` for a string; for a
  non-string it is `false`, like every predicate.
- `identifierName()` is `true` for an ECMAScript IdentifierName: an
  `ID_Start`, `$` or `_`, then `ID_Continue`, `$`, U+200C or U+200D
  characters. The empty string is not one. Reserved words are (a property key
  may be one). Escape sequences are not decoded; the value is the name as the
  AST carries it. When called, it narrows its argument to `string`.
- `reserved(options)` consults these sets, in TypeScript's terms:

  | Set | TypeScript range | Counted when |
  | --- | --- | --- |
  | ECMAScript reserved words (`break` ... `with`, `enum`, `null`, `true`, `false`) | `FirstReservedWord`..`LastReservedWord` | always |
  | Strict-mode reserved words (`implements`, `interface`, `let`, `package`, `private`, `protected`, `public`, `static`, `yield`) | `FirstFutureReservedWord`..`LastFutureReservedWord` | `strict !== false` |
  | `await` | contextual in TypeScript; reserved in module code by ECMAScript | `strict !== false` |
  | TypeScript's contextual keywords (`abstract`, `as`, `async`, `declare`, `of`, `type`, ...) | `FirstContextualKeyword`..`LastContextualKeyword` | `typescript === true` |

  - `strict` defaults to `true` because modules are strict code. `await` is
    listed with that set because ECMAScript reserves it in the module goal;
    TypeScript keeps it contextual so that script-goal code may bind it.
  - `typescript` defaults to `false` because TypeScript's keywords are legal
    identifiers (`type`, `of`, `as`); a caller asking whether a name can bind
    does not want them.
  - Case is not normalised: `Class` is not reserved. `eval`, `arguments` and
    `undefined` are not reserved words; strict mode refuses the first two as
    binding names, which is a binding rule, not a keyword.

## Examples

```ts
// The predicate on the captured value, once, whichever branch bound it;
// the guard types `key` as string in the Property's bag:
U.Property({
  key: U.or(U.Identifier({ name: $("key") }), U.Literal({ value: $("key") })).when(
    (bag: { key: unknown }): bag is { key: string } =>
      U.string.identifierName()(bag.key) && !U.string.reserved()(bag.key),
  ),
});

// A slot with nothing to capture takes the predicate directly:
U.Identifier({ name: U.string.reserved() });
U.Property({ key: U.Literal({ value: U.string.identifierName() }) });
U.Identifier({ name: U.string.not(U.string.reserved({ typescript: true })) });
U.Comment({ text: /TODO/ });                       // sugar for U.string.regex(/TODO/)

// Called:
U.string.reserved()("class");                      // true
U.string.reserved({ strict: false })("let");       // false
U.string.reserved({ typescript: true })("type");   // true
U.string.identifierName()("foo-bar");              // false
```
