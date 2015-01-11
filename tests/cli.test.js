var vv = require('drainpipe'),
    assert = require('assert'),
    resolve = require('path').resolve,
    parse = JSON.parse,
    str = require('util').format,
    exec = require('shelljs').exec


function run(cmd) {
  var filename = resolve(__dirname, '..', 'src', 'cli.js');
  cmd = ['node', filename, cmd].join(' ');
  return exec(cmd, {silent: true}).output;
}


describe("fish cli", function() {
  it("should display the summary", function() {
    var config = resolve(__dirname, 'fixtures/basic/.fish.yaml')
    var file = resolve(__dirname, 'fixtures/basic/data.csv')

    vv(str('--json -c %s %s', config, file))
      (run)
      (parse)
      (assert.deepEqual, {
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
})
