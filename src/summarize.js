var vv = require('drainpipe')
var map = require('lodash/map')
var uniq = require('lodash/uniq')
var values = require('lodash/values')
var reduce = require('lodash/reduce')
var filter = require('lodash/filter')
var flatten = require('lodash/flatten')
var mapValues = require('lodash/mapValues')
var difference = require('lodash/difference')

var push = Array.prototype.push

function summarize(data, conf) {
  var groups = group(data, conf.tags)
  handleUnaccounted(data, groups, conf)
  return mapValues(groups, summarizeGroup)
}

function handleUnaccounted(data, groups, conf) {
  var unaccounted = groups[conf.fallbackTag] || []
  extend(unaccounted, gatherUnaccounted(data, groups))
  if (unaccounted.length) groups[conf.fallbackTag] = unaccounted
}

function gatherUnaccounted(data, groups) {
  return difference(data, vv(groups)(values)(flatten)(uniq)())
}

function summarizeGroup(data) {
  return reduce(data, sum, {
    credit: 0,
    debit: 0,
    balance: 0
  })
}

function group(data, tags) {
  return mapValues(tags, function (strings) {
    var tagData = vv(strings)(map, function (s) {
      return matches(s, data)
    })(flatten)(uniq)()

    data = difference(data, tagData)
    return tagData
  })
}

function sum(current, d) {
  var amount = d.amount

  var result = {
    credit: current.credit,
    debit: current.debit,
    balance: current.balance + amount
  }

  if (amount > 0) result.credit += amount
  else if (amount < 0) result.debit += amount

  return result
}

function matches(s, data) {
  var re = regex(s)

  return filter(data, function (d) {
    return re.test(d.description)
  })
}

function regex(s) {
  return new RegExp(s, 'i')
}

function extend(target, source) {
  push.apply(target, source)
  return target
}

module.exports = summarize
