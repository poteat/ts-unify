# ts-unify

This is a library for writing type-safe AST transformations.

## Installation

```sh
npm i @ts-unify/eslint @ts-unify/rules
```

## Usage

```js
import { createPlugin } from "@ts-unify/eslint";
import * as rules from "@ts-unify/rules";

const tsUnifyDefaults = createPlugin(rules);

export default [
  {
    plugins: { "ts-unify": tsUnifyDefaults },
    ...tsUnifyDefaults.configs.recommended,
  },
];
```

## Design

We use the concept of unification to pattern-match on AST structure and emit
transformed structure, which encodes the AST constraints we desire.

## Type Safety

We infer the type holes of matched patterns to prove that the resultant AST is
syntactically well-typed.

## Defining your own rules

Rules are defined using a fluent interface that uses structural matching to
transform your AST.

```ts
import { U, $ } from "@ts-unify/core";

// typeof x === "undefined" --> x == null
export const typeofUndefinedToNullishCheck = U.BinaryExpression({
  operator: U.or("===", "=="),
  left: U.UnaryExpression({
    operator: "typeof",
    argument: $("expr"),
  }),
  right: U.Literal({ value: "undefined" }),
}).to(({ expr }) =>
  U.BinaryExpression({
    operator: "==",
    left: expr,
    right: U.Literal({ value: null }),
  }),
);
```
