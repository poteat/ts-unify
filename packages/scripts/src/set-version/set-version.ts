/**
 * Set every workspace package, and the root, to the version on the command
 * line: `npm run set-version -- <version>`.
 *
 * @entry
 */
import { setWorkspaceVersion } from './set-workspace-version'

setWorkspaceVersion(process.argv[2])
