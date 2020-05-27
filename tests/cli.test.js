const vv = require('drainpipe')
const resolve = require('path').resolve
const parse = JSON.parse
const str = require('util').format
const exec = require('shelljs').exec
const it = require('ava')

function run(cmd) {
  const filename = resolve(__dirname, '..', 'src', 'cli.js')
  cmd = ['node', filename, cmd].join(' ')
  return exec(cmd, { silent: true }).toString()
}

it('should display the summary', t => {
  const config = resolve(__dirname, 'fixtures/basic/.fish.yaml')
  const file = resolve(__dirname, 'fixtures/basic/data.csv')

  vv(str('--json -c %s %s', config, file))(run)(parse)(t.deepEqual, {
    a: {
      credit: 3,
      debit: -23,
      balance: -20
    },
    b: {
      credit: 20,
      debit: 0,
      balance: 20
    }
  })
})
