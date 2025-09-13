# isCapture

Type guard function to check if a value is a capture sentinel.

## Usage

```typescript
if (isCapture(value)) {
  // value is typed as Capture
  console.log(value.name);
}
```

## Purpose

Provides runtime type checking to determine if a value is a capture sentinel.
This is useful when processing patterns at runtime to distinguish capture
positions from regular values.

## Examples

### Basic type checking

```typescript
import { $, isCapture } from "ts-unify";

const capture = $("test");
console.log(isCapture(capture)); // true

const notCapture = { name: "test" };
console.log(isCapture(notCapture)); // false
```

### Pattern processing

```typescript
function processPattern(value: unknown) {
  if (isCapture(value)) {
    console.log(`Found capture: ${value.name}`);
  } else if (typeof value === "object" && value !== null) {
    // Recursively process object
    for (const key in value) {
      processPattern(value[key]);
    }
  }
}
```

### Type narrowing

```typescript
function extractName(value: unknown): string | undefined {
  if (isCapture(value)) {
    // TypeScript knows value is Capture here
    return value.name;
  }
  return undefined;
}
```

## Implementation Notes

- Checks for the presence of the Symbol brand
- Safely handles null and non-object values
- Provides TypeScript type narrowing via type predicate
