'use strict'

const { readFile } = require('fs').promises
const { readFileSync } = require('fs')
const toQuery = require('to-query')()
const { send } = require('micri')
const got = require('got')
const path = require('path')

const prism = readFileSync(path.resolve(__dirname, 'prism.js'))

const FS_CACHE = Object.create(null)

const html = (payload, theme, style) => `
<html>
  <head>
    <style>${theme}</style>
    <style>
      body {
        margin: 0;
      }

      pre[class*="language-"] {
        position: absolute;
        right: 0;
        left: 0;
        top: 0;
        bottom: 0;
        margin: 0;
        border-radius: 0;
      }

      code[class*="language-"], pre[class*="language-"] {
        padding-top: 0;
        padding-bottom: 0;
        font-weight: normal;
        font-family: "Operator Mono", "Fira Code", "SF Mono", "Roboto Mono", Menlo, monospace;
        line-height: 1.6;
        ${style};
      }
    </style>
  </head>
  <body>
    <pre>
      <code class="language-js">
${JSON.stringify(payload, null, 2)}
      </code>
    </pre>
  </body>
  <script>${prism}</script>
</html>
`

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Access-Control-Allow-Origin', '*')
  const { style, url, data, theme: themeId = 'dracula' } = toQuery(req.url)

  const theme =
    FS_CACHE[themeId] ||
    (FS_CACHE[themeId] = await readFile(
      path.resolve(`node_modules/prism-themes/themes/prism-${themeId}.css`)
    ))

  const payload = url ? await got(url).json() : data
  return send(res, 200, html(payload, theme, style))
}
