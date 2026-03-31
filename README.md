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

export default [
  {
    plugins: { "ts-unify": createPlugin(rules) },
    rules: {},
  },
];
```

## Design

We use the concept of unification to pattern-match on AST structure and emit
transformed structure, which encodes the AST constraints we desire.

## Type Safety

We infer the type holes of matched patterns to prove that the resultant AST is
syntactically well-typed.
