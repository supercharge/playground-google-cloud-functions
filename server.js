'use strict'

const Querystring = require('querystring')
const App = require('@supercharge/framework/application')

module.exports.httpHandler = async (request, response) => {
  const app = await App.fromAppRoot(__dirname).httpForServerless()

  const { server } = app
  const querystring = Querystring.stringify(request.query)

  const { statusCode, rawPayload, headers } = await server.inject({
    method: request.method,
    url: querystring ? `${request.path}?${querystring}` : request.path,
    payload: request.body,
    headers: request.headers
  })

  return response
    .status(statusCode)
    .set(headers)
    .end(rawPayload)
}
