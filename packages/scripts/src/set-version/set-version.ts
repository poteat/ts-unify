/**
 * Set every workspace package, and the root, to the version on the command
 * line: `npm run set-version -- <version>`.
 *
 * @entry
 */
import Workspace from './workspace'

Workspace.setWorkspaceVersion(process.argv[2])
