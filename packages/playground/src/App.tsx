import { useState, useCallback, useRef } from "react";
import Editor, { type Monaco } from "@monaco-editor/react";
import * as rules from "@ts-unify/rules";
import { match, extractPatterns } from "@ts-unify/engine";
import { parse } from "@typescript-eslint/typescript-estree";

const RULE_ENTRIES = Object.entries(rules).map(([exportName, transform]) => {
  const kebab = exportName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  const patterns = extractPatterns(transform);
  return { exportName, kebab, transform, patterns };
});

const DEFAULT_CODE = `// Try some patterns — click "Run" to lint

declare const x: unknown;
declare const obj: { prop: string };

// typeof x === "undefined"  →  x == null
const a = typeof x === "undefined";

// obj && obj.prop  →  obj?.prop
const b = obj && obj.prop;

// if/else return  →  ternary
function f(cond: boolean) {
  if (cond) {
    return 1;
  } else {
    return 2;
  }
}
`;

type LintMatch = {
  rule: string;
  message: string;
  line: number;
  column: number;
  endLine: number;
  endColumn: number;
};

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [matches, setMatches] = useState<LintMatch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<any>(null);

  const setMarkers = useCallback((results: LintMatch[]) => {
    const monaco = monacoRef.current;
    const editor = editorRef.current;
    if (!monaco || !editor) return;

    const model = editor.getModel();
    if (!model) return;

    const markers = results.map((m) => ({
      severity: monaco.MarkerSeverity.Warning,
      message: `[ts-unify/${m.rule}] ${m.message}`,
      startLineNumber: m.line,
      startColumn: m.column,
      endLineNumber: m.endLine,
      endColumn: m.endColumn,
    }));

    monaco.editor.setModelMarkers(model, "ts-unify", markers);
  }, []);

  const runLint = useCallback((source: string) => {
    setError(null);
    setMatches([]);

    try {
      const ast = parse(source, { range: true, loc: true });
      const foundMatches: LintMatch[] = [];

      function walk(node: any, parent?: any) {
        if (!node || typeof node !== "object") return;
        if (node.type) {
          node.parent = parent;
          for (const { kebab, patterns } of RULE_ENTRIES) {
            for (const { tag, pattern, chain } of patterns) {
              if (node.type === tag) {
                const bag = match(node, pattern, chain);
                if (bag) {
                  foundMatches.push({
                    rule: kebab,
                    message: kebab,
                    line: node.loc?.start?.line ?? 0,
                    column: (node.loc?.start?.column ?? 0) + 1,
                    endLine: node.loc?.end?.line ?? 0,
                    endColumn: (node.loc?.end?.column ?? 0) + 1,
                  });
                }
              }
            }
          }
        }
        for (const key of Object.keys(node)) {
          if (key === "parent") continue;
          const child = node[key];
          if (Array.isArray(child)) child.forEach((c: any) => walk(c, node));
          else if (child?.type) walk(child, node);
        }
      }

      walk(ast);
      setMatches(foundMatches);
      setMarkers(foundMatches);
    } catch (e: any) {
      setError(e.message ?? String(e));
    }
  }, [setMarkers]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#1e1e1e", color: "#d4d4d4", fontFamily: "system-ui" }}>
      <header style={{ padding: "10px 20px", borderBottom: "1px solid #333", display: "flex", alignItems: "center", gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 18, color: "#fff" }}>ts-unify</h1>
        <button onClick={() => runLint(code)} style={{ padding: "6px 16px", background: "#0e639c", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14 }}>
          Run
        </button>
        <span style={{ fontSize: 12, color: "#888" }}>
          {matches.length > 0 && `${matches.length} match${matches.length !== 1 ? "es" : ""}`}
        </span>
      </header>
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "4px 12px", fontSize: 11, color: "#666", borderBottom: "1px solid #333" }}>Input</div>
          <Editor
            height="100%"
            defaultLanguage="typescript"
            value={code}
            onChange={(v) => setCode(v ?? "")}
            theme="vs-dark"
            options={{ minimap: { enabled: false }, fontSize: 14, scrollBeyondLastLine: false }}
            onMount={(editor, monaco) => {
              editorRef.current = editor;
              monacoRef.current = monaco;
            }}
          />
        </div>
        <div style={{ width: 1, background: "#333" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "4px 12px", fontSize: 11, color: "#666", borderBottom: "1px solid #333" }}>Results</div>
          <div style={{ flex: 1, padding: 12, overflow: "auto", fontSize: 13 }}>
            {error ? (
              <pre style={{ color: "#f44", whiteSpace: "pre-wrap" }}>{error}</pre>
            ) : matches.length === 0 ? (
              <p style={{ color: "#555" }}>Click "Run" to lint the input.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {matches.map((m, i) => (
                  <li key={i} style={{ padding: "6px 0", borderBottom: "1px solid #2a2a2a", cursor: "pointer" }}
                    onClick={() => {
                      editorRef.current?.revealLineInCenter(m.line);
                      editorRef.current?.setPosition({ lineNumber: m.line, column: m.column });
                      editorRef.current?.focus();
                    }}
                  >
                    <span style={{ color: "#dcdcaa" }}>{m.line}:{m.column}</span>{" "}
                    <span style={{ color: "#ce9178" }}>{m.message}</span>{" "}
                    <span style={{ color: "#555" }}>{m.rule}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
