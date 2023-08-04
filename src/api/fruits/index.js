const FruitsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'fruits',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const fruitsHandler = new FruitsHandler(service, validator)
    server.route(routes(fruitsHandler))
  }
}
