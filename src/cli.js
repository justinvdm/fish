#!/usr/bin/env node


var argv = require('yargs'),
    read = require('fs').readFileSync,
    yaml = require('js-yaml').safeLoad,
    fish = require('./api').csv,
    resolve = require('path').resolve,
    display = require('./display')


argv = argv
  .usage('Usage: $0 [options] file')
  .help('help')
  .alias('c', 'config')
  .boolean('json')
  .describe('json', 'output the summary as json')
  .describe('c', 'path to config file')
  .default('c', resolve(process.env.HOME, '.fish.yaml'))
  .argv;


fish(read(argv._[0]), yaml(read(argv.config)), function(err, result) {
  if (err) return console.error(err)
  if (argv.json) return console.log(JSON.stringify(result))
  display(result)
})
