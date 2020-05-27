var lodash = require('lodash')
var map = lodash.map

function normalize(data, conf) {
  return normalizeFields(data, conf)
}

function normalizeFields(data, conf) {
  var fields = conf.fields

  return map(data, function (d) {
    return {
      amount: +d[fields.amount],
      description: d[fields.description]
    }
  })
}

module.exports = normalize
