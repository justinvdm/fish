var lodash = require('lodash'),
    defaults = lodash.defaults,
    normalize = require('./normalize'),
    summarize = require('./summarize')


function fish(data, conf) {
  conf = defaults(conf || {}, {
    tags: {},
    fields: {
      date: 'date',
      amount: 'amount',
      description: 'description'
    }
  })

  return summarize(normalize(data, conf), conf)
}


module.exports = fish
