#!/usr/bin/env node

var join = require('path').join
var express = require('express')
var open = require('open')
var request = require('request')

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

app.use('/proxy', function (req, res, next) {
  if (req.method.toUpperCase() === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin',  '*')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With')
    return next()
  }

  var proxy = request({
    uri: req.url.substr(1),
    rejectUnauthorized: false
  })

  // Proxy the error message back to the client.
  proxy.on('error', function (error) {
    res.writeHead(500)
    return res.end(error.message)
  })

  // Workaround for some remote services that do not handle
  // multi-valued Accept header properly by omitting precedence
  if (req.headers.accept) {
    req.headers.accept = req.headers.accept.split(',')[0].trim()
  }

  // Pipe the request data directly into the proxy request and back to the
  // response object. This avoids having to buffer the request body in cases
  // where they could be unexepectedly large and/or slow.
  return req.pipe(proxy).pipe(res)
})

app.listen(argv.p, function () {
  console.log('API designer running on port ' + argv.p + '...')

  open('http://localhost:' + argv.p + '/')
})
