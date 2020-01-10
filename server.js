'use strict'

const App = require('@supercharge/framework/application')
const CloudFunctionsHandler = require('@supercharge/hapi-google-cloud-functions')

let handler

exports.httpHandler = async (request, response) => {
  if (!handler) {
    const app = await App.fromAppRoot(__dirname).httpForServerless()

    const { server } = app
    handler = CloudFunctionsHandler.for(server)
  }

  return handler.proxy(request, response)
}
