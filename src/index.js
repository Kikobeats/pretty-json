'use strict'

const { readFileSync } = require('fs')
const { send } = require('micri')
const path = require('path')

const template = require('./template')

const help = readFileSync(path.resolve('src/index.html'))

const isStatic = req =>
  req.url.startsWith('/favicon.ico') || req.url.startsWith('/robots.txt')

const isHelp = req => req.url === '/'

module.exports = async (req, res) => {
  if (isHelp(req)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    return send(res, 200, help)
  }
  if (isStatic(req)) return send(res, 204, null)
  return template(req, res)
}
