export type Scenario = { key: string; label: string; code: string };

export const SCENARIOS: Scenario[] = [
  {
    key: "starter",
    label: "starter",
    code: `declare const x: unknown;
declare const obj: { prop: string };

function f(cond: boolean) {
  if (cond) {
    return 1;
  } else {
    return 2;
  }
}

const a = typeof x === "undefined";
const b = obj && obj.prop;
`,
  },
  {
    key: "grading",
    label: "grading",
    code: `// A grade calculator. Every rule that fires here is from the
// branch-collapsing cluster — if/else → ternary, null guard → ??.

declare function log(msg: string): void;

// if-return-to-ternary
function letter(score: number): string {
  if (score >= 90) {
    return "A";
  } else {
    return "B";
  }
}

// if-guarded-return-to-ternary
function pass(score: number): string {
  if (score >= 60) {
    return "pass";
  }
  return "fail";
}

// if-to-ternary-side-effect
function report(isFinal: boolean) {
  if (isFinal) {
    log("final grade recorded");
  } else {
    log("preview only");
  }
}

// normalize-ternary-order — starts with a negated condition
const tierOf = (failing: boolean) => (!failing ? "good" : "at risk");

// collapse-null-guard
function display(name: string | null): string {
  if (name === null) {
    return "anonymous";
  }
  return name;
}
`,
  },
  {
    key: "config",
    label: "config",
    code: `// Reading from a deeply-optional app config. Every rule that fires
// here is from the nullable-access cluster — guards → optional chain.

type Config = {
  server?: { host: string; port: number };
  logger?: { level: string };
  onError?: (err: Error) => void;
  cache?: { ttl: number };
};

declare const config: Config;

// guard-and-access-to-optional-chain
const host = config.server && config.server.host;

// guard-and-access-to-optional-chain
const level = config.logger && config.logger.level;

// typeof-undefined-to-nullish-check
const cacheDisabled = typeof config.cache === "undefined";

// if-guarded-call-to-optional
function report(err: Error) {
  const handler = config.onError;
  if (handler) {
    handler(err);
  }
}

// guard-and-access-to-optional-chain
const ttl = config.cache && config.cache.ttl;
`,
  },
  {
    key: "analytics",
    label: "analytics",
    code: `// Aggregating an array of raw analytics events. Every rule that
// fires here is from the functional/array cluster — no branches,
// no nullable chains.

type Event = { id: string; user: string; kind: string };

declare const events: Event[];
declare const defaults: { source: string };

// singular-function-to-arrow — single-return fn decl
function kindOf(e: Event) {
  return e.kind;
}

// elide-braces-for-return — arrow body is { return ... }
const userOf = (e: Event) => {
  return e.user;
};

// array-from-map-to-array-from
const kinds = Array.from(events).map((e) => e.kind);

// spread-new-set-to-uniq
const uniqueUsers = [...new Set(events.map(userOf))];

// guarded-for-push-to-filter-map
function collectClicks(): Event[] {
  const clicks: Event[] = [];
  for (const e of events) {
    if (e.kind === "click") {
      clicks.push(e);
    }
  }
  return clicks;
}

// object-assign-to-spread
const summary = Object.assign({}, defaults, {
  total: events.length,
  unique: uniqueUsers.length,
});
`,
  },
];

export const DEFAULT_CODE = SCENARIOS[0].code;
