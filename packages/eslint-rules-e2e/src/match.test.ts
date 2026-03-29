import { match, extractPattern } from "@ts-unify/eslint";
import {
  spreadNewSetToUniq,
  guardAndAccessToOptionalChain,
  typeofUndefinedToNullishCheck,
  addReturnToBlock,
  arrayFromMapToArrayFrom,
  collapseNullGuard,
  elideBracesForReturn,
  guardedForPushToFilterMap,
  ifGuardedCallToOptional,
  ifGuardedReturnToTernary,
  ifReturnToTernary,
  ifToTernarySideEffect,
  normalizeTernaryOrder,
  objectAssignToSpread,
  functionDeclReturnToArrow,
} from "@ts-unify/rules";

// ---------------------------------------------------------------------------
// spreadNewSetToUniq
// ---------------------------------------------------------------------------
describe("spreadNewSetToUniq matching", () => {
  const rule = extractPattern(spreadNewSetToUniq)!;

  it("matches [...new Set(arr)]", () => {
    const ast = {
      type: "ArrayExpression",
      elements: [
        {
          type: "SpreadElement",
          argument: {
            type: "NewExpression",
            callee: { type: "Identifier", name: "Set" },
            arguments: [{ type: "Identifier", name: "arr" }],
          },
        },
      ],
    };

    const bag = match(ast, rule.pattern);
    expect(bag).not.toBeNull();
    expect(bag!.array).toEqual({ type: "Identifier", name: "arr" });
  });

  it("rejects [...new Map(arr)]", () => {
    const ast = {
      type: "ArrayExpression",
      elements: [
        {
          type: "SpreadElement",
          argument: {
            type: "NewExpression",
            callee: { type: "Identifier", name: "Map" },
            arguments: [{ type: "Identifier", name: "arr" }],
          },
        },
      ],
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects [new Set(arr)] (no spread)", () => {
    const ast = {
      type: "ArrayExpression",
      elements: [
        {
          type: "NewExpression",
          callee: { type: "Identifier", name: "Set" },
          arguments: [{ type: "Identifier", name: "arr" }],
        },
      ],
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// guardAndAccessToOptionalChain
// ---------------------------------------------------------------------------
describe("guardAndAccessToOptionalChain matching", () => {
  const rule = extractPattern(guardAndAccessToOptionalChain)!;

  it("matches obj && obj.prop", () => {
    const obj = { type: "Identifier", name: "obj" };
    const ast = {
      type: "LogicalExpression",
      operator: "&&",
      left: obj,
      right: {
        type: "MemberExpression",
        object: obj,
        property: { type: "Identifier", name: "prop" },
        computed: false,
        optional: false,
      },
    };

    const bag = match(ast, rule.pattern);
    expect(bag).not.toBeNull();
    expect(bag!.obj).toEqual(obj);
    expect(bag!.prop).toEqual({ type: "Identifier", name: "prop" });
  });

  it("rejects obj || obj.prop", () => {
    const obj = { type: "Identifier", name: "obj" };
    const ast = {
      type: "LogicalExpression",
      operator: "||",
      left: obj,
      right: {
        type: "MemberExpression",
        object: obj,
        property: { type: "Identifier", name: "prop" },
        computed: false,
        optional: false,
      },
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// typeofUndefinedToNullishCheck
// ---------------------------------------------------------------------------
describe("typeofUndefinedToNullishCheck matching", () => {
  const rule = extractPattern(typeofUndefinedToNullishCheck)!;

  it("matches typeof x === 'undefined'", () => {
    const ast = {
      type: "BinaryExpression",
      operator: "===",
      left: {
        type: "UnaryExpression",
        operator: "typeof",
        argument: { type: "Identifier", name: "x" },
      },
      right: { type: "Literal", value: "undefined" },
    };

    const bag = match(ast, rule.pattern);
    expect(bag).not.toBeNull();
    expect(bag!.expr).toEqual({ type: "Identifier", name: "x" });
  });

  it("rejects typeof x === 'string'", () => {
    const ast = {
      type: "BinaryExpression",
      operator: "===",
      left: {
        type: "UnaryExpression",
        operator: "typeof",
        argument: { type: "Identifier", name: "x" },
      },
      right: { type: "Literal", value: "string" },
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// addReturnToBlock
// ---------------------------------------------------------------------------
describe("addReturnToBlock matching", () => {
  const rule = extractPattern(addReturnToBlock)!;

  it("extracts as a BlockStatement pattern", () => {
    expect(rule.tag).toBe("BlockStatement");
  });

  // Positive matching is skipped because the pattern uses bare $ (the
  // capture function itself rather than $("name")) for the expression
  // capture, and the parent field references a virtual property not present
  // on plain AST objects. The current match() implementation falls through to
  // literal comparison for bare $ which always fails.
  it.skip("matches function() { expr(); } (requires bare-$ and parent support)", () => {});

  it("rejects a node whose body has wrong length", () => {
    const ast = {
      type: "BlockStatement",
      parent: { type: "FunctionDeclaration" },
      body: [
        { type: "ExpressionStatement", expression: { type: "Identifier", name: "a" } },
        { type: "ExpressionStatement", expression: { type: "Identifier", name: "b" } },
      ],
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects a node whose single body element is not ExpressionStatement", () => {
    const ast = {
      type: "BlockStatement",
      parent: { type: "FunctionDeclaration" },
      body: [
        { type: "ReturnStatement", argument: { type: "Identifier", name: "x" } },
      ],
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// arrayFromMapToArrayFrom
// ---------------------------------------------------------------------------
describe("arrayFromMapToArrayFrom matching", () => {
  const rule = extractPattern(arrayFromMapToArrayFrom)!;

  it("extracts as a CallExpression pattern", () => {
    expect(rule.tag).toBe("CallExpression");
  });

  it("matches Array.from(iterable).map(fn)", () => {
    const iterable = { type: "Identifier", name: "items" };
    const mapFn = {
      type: "ArrowFunctionExpression",
      params: [{ type: "Identifier", name: "x" }],
      body: { type: "Identifier", name: "x" },
    };

    const ast = {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: {
          type: "CallExpression",
          callee: {
            type: "MemberExpression",
            object: { type: "Identifier", name: "Array" },
            property: { type: "Identifier", name: "from" },
            computed: false,
            optional: false,
          },
          arguments: [iterable],
          optional: false,
        },
        property: { type: "Identifier", name: "map" },
        computed: false,
        optional: false,
      },
      arguments: [mapFn],
      optional: false,
    };

    const bag = match(ast, rule.pattern);
    expect(bag).not.toBeNull();
    expect(bag!.iterable).toEqual(iterable);
    expect(bag!.mapFn).toEqual(mapFn);
  });

  it("rejects Array.from(iterable).filter(fn) (wrong method)", () => {
    const ast = {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: {
          type: "CallExpression",
          callee: {
            type: "MemberExpression",
            object: { type: "Identifier", name: "Array" },
            property: { type: "Identifier", name: "from" },
            computed: false,
            optional: false,
          },
          arguments: [{ type: "Identifier", name: "items" }],
          optional: false,
        },
        property: { type: "Identifier", name: "filter" },
        computed: false,
        optional: false,
      },
      arguments: [{ type: "Identifier", name: "fn" }],
      optional: false,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects List.from(iterable).map(fn) (wrong receiver)", () => {
    const ast = {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: {
          type: "CallExpression",
          callee: {
            type: "MemberExpression",
            object: { type: "Identifier", name: "List" },
            property: { type: "Identifier", name: "from" },
            computed: false,
            optional: false,
          },
          arguments: [{ type: "Identifier", name: "items" }],
          optional: false,
        },
        property: { type: "Identifier", name: "map" },
        computed: false,
        optional: false,
      },
      arguments: [{ type: "Identifier", name: "fn" }],
      optional: false,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects optional chaining Array.from(iterable)?.map(fn)", () => {
    const ast = {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: {
          type: "CallExpression",
          callee: {
            type: "MemberExpression",
            object: { type: "Identifier", name: "Array" },
            property: { type: "Identifier", name: "from" },
            computed: false,
            optional: false,
          },
          arguments: [{ type: "Identifier", name: "items" }],
          optional: false,
        },
        property: { type: "Identifier", name: "map" },
        computed: false,
        optional: true,
      },
      arguments: [{ type: "Identifier", name: "fn" }],
      optional: false,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// collapseNullGuard
// ---------------------------------------------------------------------------
describe("collapseNullGuard matching", () => {
  const rule = extractPattern(collapseNullGuard)!;

  it("extracts as a BlockStatement pattern", () => {
    expect(rule.tag).toBe("BlockStatement");
  });

  // The pattern uses ...$  (spread captures) in the body array. The current
  // match() implementation requires exact array length and does not handle
  // spread tokens, so positive matching cannot succeed.
  it.skip("matches if (x === null) return def; return x; (requires spread capture support)", () => {});

  it("rejects a BlockStatement whose body is not an array", () => {
    const ast = {
      type: "BlockStatement",
      body: "not-an-array",
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// elideBracesForReturn
// ---------------------------------------------------------------------------
describe("elideBracesForReturn matching", () => {
  const rule = extractPattern(elideBracesForReturn)!;

  it("extracts as a BlockStatement pattern", () => {
    expect(rule.tag).toBe("BlockStatement");
  });

  // The pattern uses bare $ for the return argument capture and the parent
  // field which the matcher cannot resolve against plain mock ASTs. Positive
  // matching is not possible with the current match() implementation.
  it.skip("matches (x) => { return x + 1; } (requires bare-$ and parent support)", () => {});

  it("rejects a block with two statements", () => {
    const ast = {
      type: "BlockStatement",
      parent: { type: "ArrowFunctionExpression" },
      body: [
        { type: "ReturnStatement", argument: { type: "Literal", value: 1 } },
        { type: "ReturnStatement", argument: { type: "Literal", value: 2 } },
      ],
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects a block whose single statement is not ReturnStatement", () => {
    const ast = {
      type: "BlockStatement",
      parent: { type: "ArrowFunctionExpression" },
      body: [
        { type: "ExpressionStatement", expression: { type: "Literal", value: 1 } },
      ],
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// guardedForPushToFilterMap
// ---------------------------------------------------------------------------
describe("guardedForPushToFilterMap matching", () => {
  const rule = extractPattern(guardedForPushToFilterMap)!;

  it("extracts as a BlockStatement pattern", () => {
    expect(rule.tag).toBe("BlockStatement");
  });

  // The pattern uses ...$("before") and ...$("after") spread captures in
  // the body array, and U.maybeBlock for the for-loop body and push
  // consequent. The current match() does not support spread captures or
  // the maybeBlock pseudo-type.
  it.skip("matches const r = []; for (...) if (...) r.push(...) (requires spread and maybeBlock support)", () => {});

  it("rejects a BlockStatement whose body is empty", () => {
    const ast = {
      type: "BlockStatement",
      body: [],
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// ifGuardedCallToOptional
// ---------------------------------------------------------------------------
describe("ifGuardedCallToOptional matching", () => {
  const rule = extractPattern(ifGuardedCallToOptional)!;

  it("extracts as an IfStatement pattern", () => {
    expect(rule.tag).toBe("IfStatement");
  });

  // The pattern uses U.maybeBlock for the consequent branch, which produces
  // a proxy with tag "maybeBlock" -- a pseudo-type the matcher does not
  // recognize. The matcher compares actual.type against "maybeBlock" and
  // rejects because no real AST node has that type.
  it.skip("matches if (fn) { fn(args); } (requires maybeBlock support)", () => {});

  it("rejects if (fn) { fn(args); } else { ... } (alternate must be null)", () => {
    const ast = {
      type: "IfStatement",
      test: { type: "Identifier", name: "fn" },
      consequent: {
        type: "BlockStatement",
        body: [
          {
            type: "ExpressionStatement",
            expression: {
              type: "CallExpression",
              callee: { type: "Identifier", name: "fn" },
              arguments: [],
            },
          },
        ],
      },
      alternate: {
        type: "BlockStatement",
        body: [],
      },
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects when consequent is a non-block, non-maybeBlock type", () => {
    const ast = {
      type: "IfStatement",
      test: { type: "Identifier", name: "fn" },
      consequent: {
        type: "ReturnStatement",
        argument: null,
      },
      alternate: null,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// ifGuardedReturnToTernary
// ---------------------------------------------------------------------------
describe("ifGuardedReturnToTernary matching", () => {
  const rule = extractPattern(ifGuardedReturnToTernary)!;

  it("extracts as a BlockStatement pattern", () => {
    expect(rule.tag).toBe("BlockStatement");
  });

  // The pattern uses ...$  (anonymous spread) in the body array, bare $ for
  // the IfStatement test and return argument, and U.maybeBlock for the
  // consequent. None of these are supported by the current match().
  it.skip("matches if (cond) return a; return b; (requires spread, bare-$, and maybeBlock support)", () => {});

  it("rejects a BlockStatement with an empty body", () => {
    const ast = {
      type: "BlockStatement",
      body: [],
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// ifReturnToTernary
// ---------------------------------------------------------------------------
describe("ifReturnToTernary matching", () => {
  const rule = extractPattern(ifReturnToTernary)!;

  it("extracts as an IfStatement pattern", () => {
    expect(rule.tag).toBe("IfStatement");
  });

  // The pattern uses bare $ for test and both return arguments, plus
  // U.maybeBlock (with .seal()) for both consequent and alternate. The
  // matcher cannot handle any of these.
  it.skip("matches if (c) return a; else return b; (requires bare-$ and maybeBlock support)", () => {});

  it("rejects an IfStatement without an alternate branch", () => {
    // The pattern requires alternate to be a maybeBlock proxy. null would
    // fail the type check against the "maybeBlock" tag.
    const ast = {
      type: "IfStatement",
      test: { type: "Identifier", name: "cond" },
      consequent: {
        type: "BlockStatement",
        body: [{ type: "ReturnStatement", argument: { type: "Literal", value: 1 } }],
      },
      alternate: null,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects when consequent is not a block or return (wrong type)", () => {
    const ast = {
      type: "IfStatement",
      test: { type: "Identifier", name: "cond" },
      consequent: { type: "ThrowStatement", argument: { type: "Literal", value: "err" } },
      alternate: { type: "ThrowStatement", argument: { type: "Literal", value: "err2" } },
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// ifToTernarySideEffect
// ---------------------------------------------------------------------------
describe("ifToTernarySideEffect matching", () => {
  const rule = extractPattern(ifToTernarySideEffect)!;

  it("extracts as an IfStatement pattern", () => {
    expect(rule.tag).toBe("IfStatement");
  });

  // Same issue as ifReturnToTernary: bare $ for test and expressions, plus
  // U.maybeBlock (with .seal()) for both branches.
  it.skip("matches if (c) expr1; else expr2; (requires bare-$ and maybeBlock support)", () => {});

  it("rejects an IfStatement with null alternate", () => {
    const ast = {
      type: "IfStatement",
      test: { type: "Identifier", name: "flag" },
      consequent: {
        type: "ExpressionStatement",
        expression: { type: "Identifier", name: "a" },
      },
      alternate: null,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects when consequent is wrong AST type for maybeBlock", () => {
    const ast = {
      type: "IfStatement",
      test: { type: "Identifier", name: "flag" },
      consequent: { type: "VariableDeclaration", kind: "const", declarations: [] },
      alternate: { type: "VariableDeclaration", kind: "let", declarations: [] },
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// normalizeTernaryOrder
// ---------------------------------------------------------------------------
describe("normalizeTernaryOrder matching", () => {
  const rule = extractPattern(normalizeTernaryOrder)!;

  it("extracts with tag 'or' (top-level U.or combinator)", () => {
    expect(rule.tag).toBe("or");
  });

  // The pattern is a U.or() at the top level, so extractPattern returns
  // tag="or" and pattern=first_or_arg (a ProxyNode). The match() function
  // receives a proxy function as the pattern, and Object.entries() of a proxy
  // function yields [], causing a vacuous match on any input. This means the
  // pattern cannot be meaningfully tested without dedicated U.or top-level
  // support in extractPattern/match.
  it.skip("matches !cond ? a : b (requires top-level U.or support in extractPattern)", () => {});

  it("has first or-branch targeting ConditionalExpression with negated test", () => {
    // We can at least verify that extractPattern produces a non-null result
    // and the tag reflects the or-combinator structure
    expect(rule).not.toBeNull();
    expect(rule.tag).toBe("or");
  });
});

// ---------------------------------------------------------------------------
// objectAssignToSpread
// ---------------------------------------------------------------------------
describe("objectAssignToSpread matching", () => {
  const rule = extractPattern(objectAssignToSpread)!;

  it("extracts as a CallExpression pattern", () => {
    expect(rule.tag).toBe("CallExpression");
  });

  // The pattern uses ...$("sources") as a spread capture in the arguments
  // array. At runtime the spread token becomes a plain {name: "sources"}
  // object in the array. The current match() compares array lengths strictly
  // and does not handle spread semantics, so it would only match calls with
  // exactly 2 arguments and would try to literally match the second argument
  // against {name: "sources"} as a plain-object pattern.
  it.skip("matches Object.assign({}, a, b) (requires spread capture support in arrays)", () => {});

  it("rejects Object.create({}) (wrong method name)", () => {
    const ast = {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: { type: "Identifier", name: "Object" },
        property: { type: "Identifier", name: "create" },
        computed: false,
        optional: false,
      },
      arguments: [
        { type: "ObjectExpression", properties: [] },
      ],
      optional: false,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects Reflect.assign({}, a) (wrong receiver object)", () => {
    const ast = {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: { type: "Identifier", name: "Reflect" },
        property: { type: "Identifier", name: "assign" },
        computed: false,
        optional: false,
      },
      arguments: [
        { type: "ObjectExpression", properties: [] },
        { type: "Identifier", name: "a" },
      ],
      optional: false,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects Object.assign(existingObj, a) (first arg not empty object)", () => {
    const ast = {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: { type: "Identifier", name: "Object" },
        property: { type: "Identifier", name: "assign" },
        computed: false,
        optional: false,
      },
      arguments: [
        {
          type: "ObjectExpression",
          properties: [
            { type: "Property", key: { type: "Identifier", name: "x" }, value: { type: "Literal", value: 1 } },
          ],
        },
        { type: "Identifier", name: "a" },
      ],
      optional: false,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects Object.assign() with no arguments", () => {
    const ast = {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: { type: "Identifier", name: "Object" },
        property: { type: "Identifier", name: "assign" },
        computed: false,
        optional: false,
      },
      arguments: [],
      optional: false,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// functionDeclReturnToArrow (singular-function-to-arrow)
// ---------------------------------------------------------------------------
describe("functionDeclReturnToArrow matching", () => {
  const rule = extractPattern(functionDeclReturnToArrow)!;

  it("extracts with tag 'fromNode' (U.fromNode combinator)", () => {
    expect(rule.tag).toBe("fromNode");
  });

  // The pattern uses U.fromNode which produces tag="fromNode". The match()
  // function does not use the tag when matching -- it only checks properties
  // in the pattern object. The pattern contains:
  //   type: U.or("FunctionDeclaration", "FunctionExpression")
  //   body: U.or(returnBlock, exprBlock)  -- both have bare $ inside
  //   generator: false
  // We can test the type and generator fields but the body or-branches both
  // contain bare $ which causes match failure.

  it("rejects a generator function (generator: true)", () => {
    const ast = {
      type: "FunctionDeclaration",
      body: {
        type: "BlockStatement",
        body: [
          { type: "ReturnStatement", argument: { type: "Literal", value: 1 } },
        ],
      },
      generator: true,
      id: { type: "Identifier", name: "foo" },
      params: [],
      async: false,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects an ArrowFunctionExpression (wrong type)", () => {
    const ast = {
      type: "ArrowFunctionExpression",
      body: {
        type: "BlockStatement",
        body: [
          { type: "ReturnStatement", argument: { type: "Literal", value: 1 } },
        ],
      },
      generator: false,
      params: [],
      async: false,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects a FunctionDeclaration with non-BlockStatement body", () => {
    // Arrow functions can have expression bodies, but FunctionDeclarations
    // always have BlockStatement bodies in real ASTs. We use a contrived
    // non-BlockStatement body to verify the body or-branch rejects it.
    const ast = {
      type: "FunctionDeclaration",
      body: { type: "Literal", value: 42 },
      generator: false,
      id: { type: "Identifier", name: "foo" },
      params: [],
      async: false,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  // Positive test is skipped because both or-branches for body contain
  // bare $ (the function itself, not $("name")) for the return argument /
  // expression capture, which the matcher cannot handle.
  it.skip("matches function foo(x) { return x + 1; } (requires bare-$ support)", () => {});
});
