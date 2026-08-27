import Editor, { type Monaco } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Group, Panel, Separator } from 'react-resizable-panels'

import Editing from './editing'
import Panes from './panes'
import Running from './running'
import Scenarios from './scenarios'
import Sets from './sets'
import Settings from './settings'
import './style/app.css'
import Tabs from './tabs'
import Theme from './theme'
import type Types from './types'

/**
 * The playground: a Monaco editor over a scenario, the rules run on every
 * edit, and the matches and their fixes listed beside it.
 *
 * Cmd+S applies every fix in the editor; Cmd+Z and Shift+Cmd+Z undo and
 * redo there.
 */
export function App() {
  const [code, setCode] = useState(Scenarios.DEFAULT_CODE)
  const [scenarioKey, setScenarioKey] = useState<string>(
    Scenarios.SCENARIOS[0].key,
  )
  const [enabledRules, setEnabledRules] = useState<Set<string>>(
    () => new Set(Running.DEFAULT_ENABLED),
  )
  const [leftTab, setLeftTab] = useState<Types.LeftTab>('catalog')
  const [sourceTab, setSourceTab] = useState<Types.SourceTab>('source')
  const [outputTab, setOutputTab] = useState<Types.OutputTab>('diff')

  const monacoRef = useRef<Monaco | null>(null)
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const enabledRulesRef = useRef<Set<string>>(new Set())
  const [monacoApi, setMonacoApi] = useState<Monaco | null>(null)

  const { matches, ast, error } = useMemo(
    () => Running.runLint(code, enabledRules),
    [code, enabledRules],
  )
  const matchesRef = useRef(matches)
  matchesRef.current = matches
  enabledRulesRef.current = enabledRules
  const codeRef = useRef(code)
  codeRef.current = code

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!(e.metaKey || e.ctrlKey)) return

      if (e.key === 's') {
        e.preventDefault()
        const before = codeRef.current
        const after = Running.applyFixes(before, enabledRulesRef.current)
        if (after === before) return
        if (Editing.replaceEditorText(editorRef.current, after)) return
        setCode(after)

        return
      }

      if (e.key === 'z') {
        const ed = editorRef.current
        if (ed?.hasWidgetFocus()) return
        if (!ed) return
        e.preventDefault()
        ed.trigger('keyboard', e.shiftKey ? 'redo' : 'undo', null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const paintMarkers = useCallback(() => {
    const monaco = monacoRef.current
    const ed = editorRef.current
    if (!monaco || !ed) return
    const model = ed.getModel()
    if (!model) return
    monaco.editor.setModelMarkers(
      model,
      'ts-unify',
      matchesRef.current.map(m => ({
        severity: monaco.MarkerSeverity.Warning,
        message: `[ts-unify/${m.rule}] ${m.message}`,
        startLineNumber: m.line,
        startColumn: m.column,
        endLineNumber: m.endLine,
        endColumn: m.endColumn,
      })),
    )
  }, [])

  useEffect(() => {
    paintMarkers()
  }, [matches, sourceTab, paintMarkers])

  const toggleRule = useCallback(
    (kebab: string) => setEnabledRules(prev => Sets.toggled(prev, kebab)),
    [],
  )

  const jumpToMatch = useCallback((m: Types.PlaygroundMatch) => {
    setSourceTab('source')
    const ed = editorRef.current
    if (!ed) return
    ed.revealLineInCenter(m.line)
    ed.setPosition({ lineNumber: m.line, column: m.column })
    ed.focus()
  }, [])

  const isCatalogTab = leftTab === 'catalog'
  const hasMatches = matches.length > 0
  const isDiffOutput = outputTab === 'diff'
  const isSourceOutput = outputTab === 'source'
  const isSourceTab = sourceTab === 'source'
  const hasError = error !== null

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
          <Panel {...Settings.PANEL_SIZES.sidebar}>
            <Group orientation="vertical">
              <Panel {...Settings.PANEL_SIZES.sidebarTop}>
                <section className="panel">
                  <div className="panel-header">
                    <Tabs.TabBar
                      tabs={Tabs.LEFT_TABS}
                      active={leftTab}
                      onSelect={setLeftTab}
                    />
                    <span className="panel-meta">
                      {enabledRules.size} enabled
                    </span>
                  </div>
                  <div className="panel-body">
                    {isCatalogTab ? (
                      <>
                        <div className="rule-list">
                          {Running.ALL_RULES.map(r => (
                            <div
                              key={r.kebab}
                              className={
                                enabledRules.has(r.kebab)
                                  ? 'rule-item enabled'
                                  : 'rule-item disabled'
                              }
                              onClick={() => toggleRule(r.kebab)}
                            >
                              <div className="checkbox" />
                              <div className="body">
                                <div className="name">{r.kebab}</div>
                                <div className="desc">{r.message}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button className="new-rule-btn" disabled>
                          + new rule
                        </button>
                      </>
                    ) : (
                      <div className="empty">
                        rule authoring coming soon.
                        <br />
                        browse the catalog tab to enable existing rules.
                      </div>
                    )}
                  </div>
                </section>
              </Panel>
              <Separator className="handle handle-horiz" />
              <Panel {...Settings.PANEL_SIZES.sidebarBottom}>
                <section className="panel">
                  <div className="panel-header">
                    <div className="tabs">
                      <span className="tab active">matched rules</span>
                    </div>
                    <span className="panel-meta">
                      <span className="chip">{matches.length}</span>
                    </span>
                  </div>
                  <div className="panel-body">
                    {hasError ? (
                      <div className="error">{error}</div>
                    ) : hasMatches ? (
                      <div className="match-list">
                        {matches.map((m, i) => {
                          const isSingleLine = m.line === m.endLine

                          return (
                            <div
                              key={i}
                              className="match-item"
                              onClick={() => jumpToMatch(m)}
                            >
                              <span className="locator">
                                {m.line}:{m.column}
                              </span>
                              <span className="rule-name">{m.rule}</span>
                              <span className="hint">
                                {isSingleLine
                                  ? `line ${m.line}`
                                  : `lines ${m.line}–${m.endLine}`}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="empty">no matches</div>
                    )}
                  </div>
                </section>
              </Panel>
            </Group>
          </Panel>

          <Separator className="handle handle-vert" />

          <Panel {...Settings.PANEL_SIZES.main}>
            <Group orientation="vertical">
              <Panel {...Settings.PANEL_SIZES.mainTop}>
                <section className="panel">
                  <div className="panel-header">
                    <Tabs.TabBar
                      tabs={Tabs.SOURCE_TABS}
                      active={sourceTab}
                      onSelect={setSourceTab}
                    />
                    <span className="panel-meta">
                      <select
                        className="scenario-select"
                        value={scenarioKey}
                        onChange={e => {
                          const s = Scenarios.SCENARIOS.find(
                            s => s.key === e.target.value,
                          )

                          if (s) {
                            setScenarioKey(s.key)
                            setCode(s.code)
                          }
                        }}
                        aria-label="scenario"
                      >
                        {Scenarios.SCENARIOS.map(s => (
                          <option key={s.key} value={s.key}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      <span className="chip chip-accent">
                        {matches.length} match{matches.length === 1 ? '' : 'es'}
                      </span>
                    </span>
                  </div>
                  <div
                    className={
                      isSourceTab ? 'panel-body no-scroll' : 'panel-body'
                    }
                  >
                    {isSourceTab ? (
                      <div className="monaco-wrap">
                        <Editor
                          height="100%"
                          defaultLanguage="typescript"
                          value={code}
                          onChange={v => setCode(v ?? '')}
                          theme="ts-unify-dark"
                          beforeMount={Theme.defineMonacoTheme}
                          options={Settings.EDITOR_OPTIONS}
                          onMount={(ed, monaco) => {
                            editorRef.current = ed
                            monacoRef.current = monaco
                            setMonacoApi(monaco)
                            paintMarkers()
                          }}
                        />
                      </div>
                    ) : hasError ? (
                      <pre className="ast-view">{error}</pre>
                    ) : (
                      <Panes.HighlightedCode
                        code={JSON.stringify(ast, Running.astReplacer, 2)}
                        monaco={monacoApi}
                        language="json"
                      />
                    )}
                  </div>
                </section>
              </Panel>
              <Separator className="handle handle-horiz" />
              <Panel {...Settings.PANEL_SIZES.mainBottom}>
                <section className="panel">
                  <div className="panel-header">
                    <Tabs.TabBar
                      tabs={Tabs.OUTPUT_TABS}
                      active={outputTab}
                      onSelect={setOutputTab}
                    />
                    <span className="panel-meta">output</span>
                  </div>
                  <div className="panel-body">
                    {isDiffOutput ? (
                      <Panes.DiffView
                        code={code}
                        matches={matches}
                        monaco={monacoApi}
                      />
                    ) : isSourceOutput ? (
                      <Panes.HighlightedCode code={code} monaco={monacoApi} />
                    ) : hasError ? (
                      <pre className="ast-view">{error}</pre>
                    ) : (
                      <Panes.HighlightedCode
                        code={JSON.stringify(ast, Running.astReplacer, 2)}
                        monaco={monacoApi}
                        language="json"
                      />
                    )}
                  </div>
                </section>
              </Panel>
            </Group>
          </Panel>
        </Group>
      </main>
    </div>
  )
}
