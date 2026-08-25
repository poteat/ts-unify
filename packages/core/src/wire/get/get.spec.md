# Get

`Get<Deps>` is `<P extends Deps[number]>(provider: P) => ReturnType<P>`: the
getter a provider is handed, typed to take only the providers it declared.

```typescript
const report = (need: Get<[typeof clock, typeof settings]>) => ({
  text: `${need(settings).name}@${need(clock).now}`,
})
```

The tuple is the declaration; `DepsOf` reads it back off the parameter
type, and `Missing` checks it against what a container holds.
