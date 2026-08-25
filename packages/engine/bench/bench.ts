/**
 * Prints the benchmark over a repository's sources:
 * `node bench/dist/bench.mjs [root]`, this repository's by default.
 *
 * @entry
 */
import Run from './run'
console.log(Run.runBench(process.argv[2]))
