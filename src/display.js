var vv = require('drainpipe'),
    map = require('lodash').map,
    each = require('lodash').each,
    reduce = require('lodash').reduce,
    chalk = require('chalk'),
    Table = require('cli-table')


function display(data) {
  var table = new Table({
    head: ['tag', 'credit', 'debit', 'balance'],
    colAligns: ['left', 'right', 'right', 'right'],
    style: {
      head: ['bold', 'magenta'],
      border: ['black']
    }
  })

  vv(data)
    (map, function(d, k) { return row(k, d) })
    (pushTo, table)

  table.push(row('total', {
    debit: sum(data, 'debit'),
    credit: sum(data, 'credit'),
    balance: sum(data, 'balance')
  }))

  console.log(table.toString())
}


function sum(data, name) {
  return vv(data)
    (map, function(d) { return d[name] })
    (reduce, add, 0)
    ()
}


function add(a, b) {
  return a + b
}


function row(tag, summary) {
  tag = tag || ''

  return [
    chalk.bold(tag),
    val(summary.credit),
    val(summary.debit),
    val(summary.balance)
  ]
}


function val(v) {
  v = v.toString()
  if (v > 0) return chalk.green(v)
  if (v < 0) return chalk.red(v)
  return v
}


function pushTo(data, arr) {
  each(data, function(d) { arr.push(d) })
}


module.exports = display
