'use strict'

const toQuery = require('to-query')()
const { send } = require('micri')
const got = require('got')

const html = (payload, theme) => `
<html>
  <head>
    <link href="https://fonts.googleapis.com/css?family=PT+Mono&subset=cyrillic,cyrillic-ext,latin-ext" rel="stylesheet">
    <link href="https://raw.githack.com/PrismJS/prism-themes/master/themes/prism-${theme}.css" rel="stylesheet">
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
    </style>
  </head>
  <body>
    <pre>
      <code class="language-js">
${JSON.stringify(payload, null, 2)}
      </code>
    </pre>
  </body>
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1.19.0/prism.min.js"></script>
</html>
`

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { url, theme = 'atom-dark' } = toQuery(req.url)
  const payload = await got(url).json()

  return send(res, 200, html(payload, theme))
}
