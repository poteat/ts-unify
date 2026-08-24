/**
 * Runs the engine over a repository's sources for a profiler to sample:
 * `node --cpu-prof bench/dist/profile.mjs [root] [rounds]`.
 *
 * @entry
 */
import { profileEngine } from './profile-engine'
import Timing from './timing'

console.log(
  profileEngine(
    process.argv[2],
    Number(process.argv[3] ?? Timing.ROUNDS.profile),
  ),
)
