var vv = require('drainpipe'),
    lodash = require('lodash'),
    map = lodash.map,
    uniq = lodash.uniq,
    values = lodash.values
    reduce = lodash.reduce,
    filter = lodash.filter
    flatten = lodash.flatten,
    mapValues = lodash.mapValues,
    difference = lodash.difference


function summarize(data, conf) {
  var groups = group(data, conf.tags)
  var unaccounted = remainder(data, groups)

  if (unaccounted.length) {
    groups.unaccounted = (groups.unaccounted || []).concat(unaccounted)
  }

  return mapValues(groups, summarizeGroup)
}


function remainder(data, groups) {
  return difference(data, vv(groups)
    (values)
    (flatten)
    (uniq)
    ())
}


function summarizeGroup(data) {
  return reduce(data, sum, {
    credit: 0,
    debit: 0,
    balance: 0
  })
}


function group(data, tags) {
  return mapValues(tags, function(strings) {
    return vv(strings)
      (map, function(s) { return matches(s, data) })
      (flatten)
      (uniq)
      ()
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

  return filter(data, function(d) {
    return re.test(d.description)
  })
}


function regex(s) {
  return new RegExp(s, 'i')
}


module.exports = summarize
