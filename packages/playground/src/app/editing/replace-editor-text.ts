import type { editor } from 'monaco-editor'

/**
 * Replaces the whole text of a mounted editor as one undoable edit.
 *
 * @param ed the editor; none before it mounts
 * @param text the new text
 * @returns true when the editor took the edit; false when there is no
 *          editor or no model to edit
 */
export function replaceEditorText(
  ed: editor.IStandaloneCodeEditor | null,
  text: string,
): boolean {
  const model = ed?.getModel()

  if (!ed || !model) return false

  ed.executeEdits('ts-unify-autofix', [
    { range: model.getFullModelRange(), text },
  ])

  return true
}
