import type { Monaco } from "@monaco-editor/react";

// ---------- token colors ----------

const TOKEN_COLOR: Record<string, string> = {
  comment: "#545a69",
  keyword: "#8b8cf5",
  string: "#a8d08d",
  "string.escape": "#c9e0b0",
  "string.key": "#7dc4e4",
  regexp: "#a8d08d",
  number: "#e5b575",
  type: "#7dc4e4",
  identifier: "#cdd3dc",
  delimiter: "#767c8b",
  operator: "#b5bac2",
};

export function tokenColor(type: string): string {
  const parts = type.split(".");
  while (parts.length > 0) {
    const key = parts.join(".");
    if (TOKEN_COLOR[key]) return TOKEN_COLOR[key];
    parts.pop();
  }
  return "#cdd3dc";
}

export type Span = { text: string; color: string };

export function tokenizeLine(
  monaco: Monaco | null,
  line: string,
  language: string
): Span[] {
  if (!monaco || line.length === 0) return [{ text: line, color: "#cdd3dc" }];
  const tokens = monaco.editor.tokenize(line, language)[0] ?? [];
  if (tokens.length === 0) return [{ text: line, color: "#cdd3dc" }];
  const spans: Span[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const next = tokens[i + 1];
    const end = next ? next.offset : line.length;
    const text = line.slice(t.offset, end);
    if (text) spans.push({ text, color: tokenColor(t.type) });
  }
  return spans;
}

// ---------- JSON tokenizer ----------

function registerJsonTokenizer(monaco: Monaco) {
  const alreadyRegistered = monaco.languages
    .getLanguages()
    .some((l: { id: string }) => l.id === "json");
  if (!alreadyRegistered) {
    monaco.languages.register({ id: "json" });
  }
  monaco.languages.setMonarchTokensProvider("json", {
    tokenizer: {
      root: [
        [/"(?:[^"\\]|\\.)*"(?=\s*:)/, "string.key.json"],
        [/"(?:[^"\\]|\\.)*"/, "string.value.json"],
        [/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/, "number.json"],
        [/\b(?:true|false|null)\b/, "keyword.json"],
        [/[{}[\],:]/, "delimiter.json"],
        [/\s+/, ""],
      ],
    },
  });
}

// ---------- Monaco theme ----------

export function defineMonacoTheme(monaco: Monaco) {
  registerJsonTokenizer(monaco);
  monaco.editor.defineTheme("ts-unify-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "", foreground: "cdd3dc", background: "13161e" },
      { token: "comment", foreground: "545a69", fontStyle: "italic" },
      { token: "comment.doc", foreground: "6a7182", fontStyle: "italic" },
      { token: "keyword", foreground: "8b8cf5" },
      { token: "keyword.flow", foreground: "8b8cf5" },
      { token: "keyword.operator.expression", foreground: "8b8cf5" },
      { token: "keyword.operator.new", foreground: "8b8cf5" },
      { token: "string", foreground: "a8d08d" },
      { token: "string.escape", foreground: "c9e0b0" },
      { token: "regexp", foreground: "a8d08d" },
      { token: "number", foreground: "e5b575" },
      { token: "number.hex", foreground: "e5b575" },
      { token: "type", foreground: "7dc4e4" },
      { token: "type.identifier", foreground: "7dc4e4" },
      { token: "identifier", foreground: "cdd3dc" },
      { token: "entity.name.function", foreground: "e5c07b" },
      { token: "delimiter", foreground: "5e6475" },
      { token: "delimiter.bracket", foreground: "767c8b" },
      { token: "delimiter.parenthesis", foreground: "767c8b" },
      { token: "delimiter.curly", foreground: "767c8b" },
      { token: "delimiter.square", foreground: "767c8b" },
      { token: "operator", foreground: "b5bac2" },
    ],
    colors: {
      "editor.background": "#13161e",
      "editor.foreground": "#cdd3dc",
      "editor.lineHighlightBackground": "#181c2600",
      "editor.lineHighlightBorder": "#00000000",
      "editorLineNumber.foreground": "#3c4151",
      "editorLineNumber.activeForeground": "#767c8b",
      "editorCursor.foreground": "#8b8cf5",
      "editor.selectionBackground": "#8b8cf533",
      "editor.inactiveSelectionBackground": "#8b8cf522",
      "editor.selectionHighlightBackground": "#8b8cf522",
      "editor.wordHighlightBackground": "#8b8cf522",
      "editor.wordHighlightStrongBackground": "#8b8cf533",
      "editor.findMatchBackground": "#d9a84a44",
      "editor.findMatchHighlightBackground": "#d9a84a22",
      "editorIndentGuide.background": "#1f2430",
      "editorIndentGuide.activeBackground": "#2b3142",
      "editorWhitespace.foreground": "#1f2430",
      "editorBracketMatch.background": "#8b8cf522",
      "editorBracketMatch.border": "#8b8cf566",
      "editorGutter.background": "#13161e",
      "editorWidget.background": "#181c26",
      "editorWidget.border": "#2b3142",
      "editorHoverWidget.background": "#181c26",
      "editorHoverWidget.border": "#2b3142",
      "editorSuggestWidget.background": "#181c26",
      "editorSuggestWidget.border": "#2b3142",
      "editorSuggestWidget.selectedBackground": "#8b8cf522",
      "editorError.foreground": "#e5596a",
      "editorWarning.foreground": "#d9a84a",
      "editorInfo.foreground": "#7dc4e4",
      "scrollbar.shadow": "#00000000",
      "scrollbarSlider.background": "#2b314288",
      "scrollbarSlider.hoverBackground": "#3c4151aa",
      "scrollbarSlider.activeBackground": "#4b5160aa",
      "minimap.background": "#13161e",
      "editorOverviewRuler.border": "#1f2430",
    },
  });
}
