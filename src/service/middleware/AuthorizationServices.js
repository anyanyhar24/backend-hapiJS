const autoBind = require('auto-bind')

class AuthorizationServices {
  constructor (userService) {
    this._userService = userService

    autoBind(this)
  }

  async onlyAdminScope (request, h) {
    const { guid } = request.auth.credentials

    await this._userService.verifyAdminRole(guid)

    return h.continue
  }
}

module.exports = AuthorizationServices
