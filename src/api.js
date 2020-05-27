var defaults = require('lodash').defaults,
    parse = require('csv').parse,
    normalize = require('./normalize'),
    summarize = require('./summarize')


function fish(data, conf) {
  conf = defaults(conf || {}, {
    tags: {},
    fields: {
      amount: 'amount',
      description: 'description'
    },
    fallbackTag: 'unaccounted'
  })

  return summarize(normalize(data, conf), conf)
}


function csv(data, conf, done) {
  if (arguments.length < 3) {
    done = conf
    conf = {}
  }

  var opts = conf.csv || {}
  opts.columns = true

  parse(data, opts, function(err, data) {
    if (err) return done(err)

    var result
    try { result = fish(data, conf) }
    catch(e) { done(e) }

    done(null, result)
  })
}


fish.csv = csv
module.exports = fish
