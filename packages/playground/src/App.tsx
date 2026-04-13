import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Editor, { type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { Group, Panel, Separator } from "react-resizable-panels";
import * as rules from "@ts-unify/rules";
import { extractRuleMeta, lint, fix } from "@ts-unify/runner";
import type { LintMatch } from "@ts-unify/runner";
import { parse } from "@typescript-eslint/typescript-estree";
import { tsGenerate } from "./ts-generate";
import { SCENARIOS, DEFAULT_CODE } from "./scenarios";
import { defineMonacoTheme, tokenizeLine } from "./theme";
import "./App.css";

// ---------- rule catalog ----------

const ALL_RULES = Object.entries(rules).map(([name, transform]) =>
  extractRuleMeta(name, transform)
);

const DEFAULT_ENABLED = new Set<string>(
  ALL_RULES.filter((r) => r.recommended).map((r) => r.kebab)
);

// ---------- helpers ----------

function parseSafe(source: string) {
  return parse(source, { range: true, loc: true });
}

function runLint(source: string, enabled: Set<string>) {
  try {
    const ast = parseSafe(source);
    const enabledRules = ALL_RULES.filter((r) => enabled.has(r.kebab));
    const matches = lint(ast, enabledRules);
    // Serialize reified nodes for the diff view / autofix.
    const withRewrites = matches.map((m) => ({
      ...m,
      rewrite: m.reified ? safeSerialize(m.reified, m.rule) : null,
    }));
    return { matches: withRewrites, ast, error: null };
  } catch (e: unknown) {
    return {
      matches: [] as PlaygroundMatch[],
      ast: null,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

function safeSerialize(node: unknown, rule: string): string | null {
  try {
    return tsGenerate(node);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`[ts-unify] serialize failed for ${rule}:`, e);
    return null;
  }
}

function applyFixes(source: string, enabled: Set<string>): string {
  const enabledRules = ALL_RULES.filter((r) => enabled.has(r.kebab));
  return fix(source, enabledRules, {
    parse: parseSafe,
    serialize: tsGenerate,
  });
}

function astReplacer(key: string, value: unknown) {
  if (key === "parent" || key === "tokens" || key === "comments" || key === "range" || key === "loc") return undefined;
  return value;
}

// ---------- types ----------

type PlaygroundMatch = LintMatch & { rewrite: string | null };
type LeftTab = "rules" | "catalog";
type SourceTab = "source" | "ast";
type OutputTab = "source" | "ast" | "diff";

// ---------- diff ----------

type DiffRow =
  | { kind: "ctx"; line: string; num: number }
  | { kind: "del"; line: string; num: number }
  | { kind: "add"; line: string };

function buildDiff(code: string, matches: PlaygroundMatch[]): DiffRow[] {
  const lines = code.split("\n");
  const sorted = matches
    .filter((m) => m.rewrite != null)
    .sort((a, b) => (a.line !== b.line ? a.line - b.line : a.column - b.column));
  const usable: PlaygroundMatch[] = [];
  let lastEndLine = -1;
  let lastEndCol = -1;
  for (const m of sorted) {
    if (m.line > lastEndLine || (m.line === lastEndLine && m.column >= lastEndCol)) {
      usable.push(m);
      lastEndLine = m.endLine;
      lastEndCol = m.endColumn;
    }
  }
  const rows: DiffRow[] = [];
  let cursor = 1;
  for (const m of usable) {
    while (cursor < m.line) {
      rows.push({ kind: "ctx", num: cursor, line: lines[cursor - 1] ?? "" });
      cursor++;
    }
    for (let l = m.line; l <= m.endLine; l++) {
      rows.push({ kind: "del", num: l, line: lines[l - 1] ?? "" });
    }
    const firstLine = lines[m.line - 1] ?? "";
    const lastLine = lines[m.endLine - 1] ?? "";
    const prefix = firstLine.slice(0, m.column - 1);
    const suffix = lastLine.slice(m.endColumn - 1);
    const rewritten = (prefix + (m.rewrite ?? "") + suffix).split("\n");
    for (const r of rewritten) rows.push({ kind: "add", line: r });
    cursor = m.endLine + 1;
  }
  while (cursor <= lines.length) {
    rows.push({ kind: "ctx", num: cursor, line: lines[cursor - 1] ?? "" });
    cursor++;
  }
  return rows;
}

// ---------- component ----------

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [scenarioKey, setScenarioKey] = useState<string>(SCENARIOS[0].key);
  const [enabledRules, setEnabledRules] = useState<Set<string>>(
    () => new Set(DEFAULT_ENABLED)
  );
  const [leftTab, setLeftTab] = useState<LeftTab>("catalog");
  const [sourceTab, setSourceTab] = useState<SourceTab>("source");
  const [outputTab, setOutputTab] = useState<OutputTab>("diff");

  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const enabledRulesRef = useRef<Set<string>>(new Set());
  const [monacoApi, setMonacoApi] = useState<Monaco | null>(null);

  const result = useMemo(() => runLint(code, enabledRules), [code, enabledRules]);
  const { matches, ast, error } = result;
  const matchesRef = useRef(matches);
  matchesRef.current = matches;
  enabledRulesRef.current = enabledRules;
  const codeRef = useRef(code);
  codeRef.current = code;

  // Keyboard shortcuts (Cmd+S autofix, Cmd+Z undo, Shift+Cmd+Z redo)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!(e.metaKey || e.ctrlKey)) return;
      if (e.key === "s") {
        e.preventDefault();
        const before = codeRef.current;
        const after = applyFixes(before, enabledRulesRef.current);
        if (after === before) return;
        const ed = editorRef.current;
        const model = ed?.getModel();
        if (ed && model) {
          ed.executeEdits("ts-unify-autofix", [
            { range: model.getFullModelRange(), text: after },
          ]);
        } else {
          setCode(after);
        }
        return;
      }
      if (e.key === "z") {
        const ed = editorRef.current;
        if (ed?.hasWidgetFocus()) return;
        if (!ed) return;
        e.preventDefault();
        ed.trigger("keyboard", e.shiftKey ? "redo" : "undo", null);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Monaco markers
  const paintMarkers = useCallback(() => {
    const monaco = monacoRef.current;
    const ed = editorRef.current;
    if (!monaco || !ed) return;
    const model = ed.getModel();
    if (!model) return;
    const ms = matchesRef.current;
    const markers = ms.map((m) => ({
      severity: monaco.MarkerSeverity.Warning,
      message: `[ts-unify/${m.rule}] ${m.message}`,
      startLineNumber: m.line,
      startColumn: m.column,
      endLineNumber: m.endLine,
      endColumn: m.endColumn,
    }));
    monaco.editor.setModelMarkers(model, "ts-unify", markers);
  }, []);

  useEffect(() => { paintMarkers(); }, [matches, sourceTab, paintMarkers]);

  const toggleRule = useCallback((kebab: string) => {
    setEnabledRules((prev) => {
      const next = new Set(prev);
      if (next.has(kebab)) next.delete(kebab);
      else next.add(kebab);
      return next;
    });
  }, []);

  const jumpToMatch = useCallback((m: PlaygroundMatch) => {
    setSourceTab("source");
    const ed = editorRef.current;
    if (!ed) return;
    ed.revealLineInCenter(m.line);
    ed.setPosition({ lineNumber: m.line, column: m.column });
    ed.focus();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <span className="logo">ts-unify</span>
        <span className="tag">playground</span>
        <div className="spacer" />
        <button className="link">share</button>
        <button className="link">docs</button>
      </header>

      <main className="main">
        <Group orientation="horizontal">
          <Panel defaultSize={22} minSize={15}>
            <Group orientation="vertical">
              <Panel defaultSize={60} minSize={20}>
                <section className="panel">
                  <div className="panel-header">
                    <div className="tabs">
                      <button className={`tab ${leftTab === "rules" ? "active" : ""}`} onClick={() => setLeftTab("rules")}>rules</button>
                      <button className={`tab ${leftTab === "catalog" ? "active" : ""}`} onClick={() => setLeftTab("catalog")}>catalog</button>
                    </div>
                    <span className="panel-meta">{enabledRules.size} enabled</span>
                  </div>
                  <div className="panel-body">
                    {leftTab === "catalog" ? (
                      <>
                        <div className="rule-list">
                          {ALL_RULES.map((r) => (
                            <div key={r.kebab} className={`rule-item ${enabledRules.has(r.kebab) ? "enabled" : "disabled"}`} onClick={() => toggleRule(r.kebab)}>
                              <div className="checkbox" />
                              <div className="body">
                                <div className="name">{r.kebab}</div>
                                <div className="desc">{r.message}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button className="new-rule-btn" disabled>+ new rule</button>
                      </>
                    ) : (
                      <div className="empty">rule authoring coming soon.<br />browse the catalog tab to enable existing rules.</div>
                    )}
                  </div>
                </section>
              </Panel>
              <Separator className="handle handle-horiz" />
              <Panel defaultSize={40} minSize={15}>
                <section className="panel">
                  <div className="panel-header">
                    <div className="tabs"><span className="tab active">matched rules</span></div>
                    <span className="panel-meta"><span className="chip">{matches.length}</span></span>
                  </div>
                  <div className="panel-body">
                    {error ? (
                      <div className="error">{error}</div>
                    ) : matches.length === 0 ? (
                      <div className="empty">no matches</div>
                    ) : (
                      <div className="match-list">
                        {matches.map((m, i) => (
                          <div key={i} className="match-item" onClick={() => jumpToMatch(m)}>
                            <span className="locator">{m.line}:{m.column}</span>
                            <span className="rule-name">{m.rule}</span>
                            <span className="hint">{m.line === m.endLine ? `line ${m.line}` : `lines ${m.line}–${m.endLine}`}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </Panel>
            </Group>
          </Panel>

          <Separator className="handle handle-vert" />

          <Panel defaultSize={78} minSize={30}>
            <Group orientation="vertical">
              <Panel defaultSize={60} minSize={20}>
                <section className="panel">
                  <div className="panel-header">
                    <div className="tabs">
                      <button className={`tab ${sourceTab === "source" ? "active" : ""}`} onClick={() => setSourceTab("source")}>source</button>
                      <button className={`tab ${sourceTab === "ast" ? "active" : ""}`} onClick={() => setSourceTab("ast")}>AST</button>
                    </div>
                    <span className="panel-meta">
                      <select className="scenario-select" value={scenarioKey} onChange={(e) => { const s = SCENARIOS.find((s) => s.key === e.target.value); if (s) { setScenarioKey(s.key); setCode(s.code); } }} aria-label="scenario">
                        {SCENARIOS.map((s) => (<option key={s.key} value={s.key}>{s.label}</option>))}
                      </select>
                      <span className="chip chip-accent">{matches.length} match{matches.length === 1 ? "" : "es"}</span>
                    </span>
                  </div>
                  <div className={`panel-body ${sourceTab === "source" ? "no-scroll" : ""}`}>
                    {sourceTab === "source" ? (
                      <div className="monaco-wrap">
                        <Editor
                          height="100%"
                          defaultLanguage="typescript"
                          value={code}
                          onChange={(v) => setCode(v ?? "")}
                          theme="ts-unify-dark"
                          beforeMount={defineMonacoTheme}
                          options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false, renderLineHighlight: "none", padding: { top: 10, bottom: 10 }, fontFamily: "JetBrains Mono, SF Mono, ui-monospace, Menlo, monospace" }}
                          onMount={(ed, monaco) => { editorRef.current = ed; monacoRef.current = monaco; setMonacoApi(monaco); paintMarkers(); }}
                        />
                      </div>
                    ) : error ? (
                      <pre className="ast-view">{error}</pre>
                    ) : (
                      <HighlightedCode code={JSON.stringify(ast, astReplacer, 2)} monaco={monacoApi} language="json" />
                    )}
                  </div>
                </section>
              </Panel>
              <Separator className="handle handle-horiz" />
              <Panel defaultSize={40} minSize={15}>
                <section className="panel">
                  <div className="panel-header">
                    <div className="tabs">
                      <button className={`tab ${outputTab === "source" ? "active" : ""}`} onClick={() => setOutputTab("source")}>source</button>
                      <button className={`tab ${outputTab === "ast" ? "active" : ""}`} onClick={() => setOutputTab("ast")}>AST</button>
                      <button className={`tab ${outputTab === "diff" ? "active" : ""}`} onClick={() => setOutputTab("diff")}>diff</button>
                    </div>
                    <span className="panel-meta">output</span>
                  </div>
                  <div className="panel-body">
                    {outputTab === "diff" ? (
                      <DiffView code={code} matches={matches} monaco={monacoApi} />
                    ) : outputTab === "source" ? (
                      <HighlightedCode code={code} monaco={monacoApi} />
                    ) : error ? (
                      <pre className="ast-view">{error}</pre>
                    ) : (
                      <HighlightedCode code={JSON.stringify(ast, astReplacer, 2)} monaco={monacoApi} language="json" />
                    )}
                  </div>
                </section>
              </Panel>
            </Group>
          </Panel>
        </Group>
      </main>
    </div>
  );
}

// ---------- subcomponents ----------

function HighlightedCode({ code, monaco, language = "typescript" }: { code: string; monaco: Monaco | null; language?: string }) {
  const lines = useMemo(() => code.split("\n"), [code]);
  const lineSpans = useMemo(() => lines.map((l) => tokenizeLine(monaco, l, language)), [lines, monaco, language]);
  return (
    <pre className="code-view">
      {lineSpans.map((spans, i) => (
        <div key={i} className="code-line">
          {spans.length === 0 ? " " : spans.map((s, j) => (<span key={j} style={{ color: s.color }}>{s.text}</span>))}
        </div>
      ))}
    </pre>
  );
}

function DiffView({ code, matches, monaco }: { code: string; matches: PlaygroundMatch[]; monaco: Monaco | null }) {
  const rows = useMemo(() => buildDiff(code, matches), [code, matches]);
  const rowSpans = useMemo(() => rows.map((r) => tokenizeLine(monaco, r.line, "typescript")), [rows, monaco]);
  return (
    <div className="diff-view">
      {rows.map((row, i) => (
        <div key={i} className={`diff-line ${row.kind === "add" ? "add" : row.kind === "del" ? "del" : ""}`}>
          <span className="gutter">{row.kind === "add" ? "" : row.num}</span>
          <span className="content">
            {rowSpans[i].length === 0 ? " " : rowSpans[i].map((s, j) => (<span key={j} style={{ color: s.color }}>{s.text}</span>))}
          </span>
        </div>
      ))}
    </div>
  );
}

export default App;
