export const NODE = Symbol.for("ts-unify.node");
// The proxy is inherently untyped: it intercepts arbitrary property access and
// function calls to build up a ProxyNode descriptor at runtime.  TypeScript's
// Proxy typing cannot express this dynamic shape, so `any` on the return type
// and spread args is unavoidable.  The cast to `BuilderMap` at the export site
// restores type safety for callers.
function makeProxy(node) {
    return new Proxy(function () { }, {
        get(_, prop) {
            if (prop === NODE)
                return node;
            if (typeof prop === "symbol")
                return undefined;
            if (node) {
                // Fluent method on an existing node — return callable that appends to chain
                const method = prop;
                return (...args) => makeProxy({ ...node, chain: [...node.chain, { method, args }] });
            }
            // Builder access on root — return callable that creates a node
            const tag = prop;
            return (...args) => makeProxy({ tag, args, chain: [] });
        },
        apply(_, __, args) {
            return makeProxy({ tag: "", args, chain: [] });
        },
    });
}
/** AST pattern builder namespace. */
export const U = makeProxy();
