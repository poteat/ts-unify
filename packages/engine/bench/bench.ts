/**
 * Prints the benchmark over a repository's sources:
 * `node bench/dist/bench.mjs [root]`, this repository's by default.
 *
 * @entry
 */
import { runBench } from './run-bench'

console.log(runBench(process.argv[2]))
