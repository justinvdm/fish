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
    }
  })

  return summarize(normalize(data, conf), conf)
}


function csv(csv, conf, done) {
  if (arguments.length < 3) {
    done = conf
    conf = {}
  }

  parse(csv, {columns: true}, function(err, data) {
    if (err) return done(err)

    var result
    try { result = fish(data, conf) }
    catch(e) { done(e) }

    done(null, result)
  })
}


fish.csv = csv
module.exports = fish
