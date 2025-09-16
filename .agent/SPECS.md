# Specs Authoring Guide

This guide standardizes how to write module specs (`*.spec.md`) so they remain
consistent, concise, and useful over time.

## Purpose

- Specs document a module's semantics and design, beyond the short API-focused
  JSDoc in code. They prioritize intent, tradeoffs, and examples.
- Specs follow the import graph: a module documents itself and providers it
  imports. It does not describe downstream consumers.

## Structure

Use this section order unless a module justifies deviations:

1. Title — `# ModuleName`
2. Overview — short paragraph explaining what the module provides.
3. Scope — what the module covers and what it deliberately does not (provider vs
   consumer responsibilities).
4. Design (or Design Notes) — key decisions, tradeoffs, performance or typing
   considerations. Keep this evergreen (avoid concrete symbol names where
   possible).
5. Semantics — bullet list of behavioral rules or type-level rules.
6. Examples — 1–3 concise code snippets showing typical usage.
7. Non‑Goals (optional) — explicitly state what is out of scope.

## Style

- Keep sections succinct; prefer bullets over narrative when possible.
- Code blocks should be minimal and compile in isolation if practical.
- Use consistent terminology across specs. Define new terms briefly.
- Favor type-level clarity; avoid runtime details unless the module defines
  runtime behavior.

## Scope Boundaries

- Provider modules (types and factories) should not describe consumer behavior
  beyond what is required to clarify their own semantics.
- If cross-module interactions matter, link to the other module's spec and state
  the assumption rather than duplicating details.

## Examples Template

````md
# ModuleName

## Overview

One or two sentences.

## Scope

- Provider/consumer boundaries.

## Design

- Key design notes.

## Semantics

- Rule 1
- Rule 2

## Examples

```ts
// concise snippet
```
````
