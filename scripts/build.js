const rollup = require('./lib/rollup')
const tsc = require('./lib/tsc')
const dts = require('./lib/dts')
const rm = require('./lib/rm')
const targets = require('./targets')

async function run() {
  for (const target of targets) {
    await rollup(target)
    await tsc(target)
    dts(target)
    rm(target)
  }
}

run()