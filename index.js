'use strict'

const Querystring = require('querystring')
const App = require('@supercharge/framework/application')

module.exports.http = async (request, response) => {
  const app = await App.fromAppRoot(__dirname).httpForServerless()

  const { server } = app
  const querystring = Querystring.stringify(request.query)

  const { statusCode, payload, rawPayload, headers } = await server.inject({
    method: request.method,
    url: querystring ? `${request.path}?${querystring}` : request.path,
    payload: request.body,
    headers: request.headers
  })

  // const { 'content-type': type, 'content-encoding': encoding } = headers
  // const isBase64Encoded = Boolean(type && !type.match(/; *charset=/)) || Boolean(encoding && encoding !== 'identity')

  // const payload = isBase64Encoded ? rawPayload.toString('base64') : body

  // chunked transfer not currently supported by API Gateway
  if (headers['transfer-encoding'] === 'chunked') {
    delete headers['transfer-encoding']
  }

  const finalHeaders = Object
    .entries(headers || {})
    .reduce((collect, [name, value]) => ({
      ...collect,
      [name]: (value.length === 1) ? value[0] : value
    }), {})

  // console.log(finalHeaders)

  console.log(payload)

  return response.status(statusCode).set(finalHeaders).send(payload)
}
