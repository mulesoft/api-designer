#!/usr/bin/env node

var join = require('path').join
var express = require('express')

var argv = require('yargs')
  .usage('Usage: $0 -p [num]')
  .option('p', {
    alias: 'port',
    default: 3000,
    describe: 'Port number to run the API designer',
    type: 'number'
  })
  .argv

var app = express()

app.use(express.static(join(__dirname, '../dist')))

app.listen(argv.p, function () {
  console.log(
    'API designer running, open http://localhost:' + argv.p + ' to use...'
  )
})
