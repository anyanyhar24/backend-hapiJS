const autoBind = require('auto-bind')

class AuthenticationHandler {
  constructor (authenticationService, userService, tokenManager, validator) {
    this._authenticationsService = authenticationService
    this._userService = userService
    this._tokenManager = tokenManager
    this._validator = validator

    autoBind(this)
  }

  async postAuthenticationHandler (request) {
    await this._validator.validatePostAuthenticationPayload(request.payload)

    const id = await this._userService.verifyCredentials(request.payload)

    const accessToken = await this._tokenManager.generateAccessToken({ id })
    const refreshToken = await this._tokenManager.generateRefreshToken({ id })

    await this._authenticationsService.addRefreshToken(refreshToken, id)

    return {
      status: 'success',
      message: 'Berhasil Login',
      data: {
        accessToken,
        refreshToken
      }
    }
  }

  async putAuthenticationHandler (request) {
    await this._validator.validatePutAuthenticationPayload(request.payload)

    const { refreshToken } = request.payload

    await this._authenticationsService.verifyRefreshToken(refreshToken)

    const { id } = this._tokenManager.verifyRefreshToken(refreshToken)
    const accessToken = this._tokenManager.generateAccessToken({ id })

    return {
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken
      }
    }
  }

  async deleteAuthenticationHandler (request) {
    await this._validator.validateDeleteAuthenticationPayload(request.payload)

    const { refreshToken } = request.payload

    await this._authenticationsService.verifyRefreshToken(refreshToken)
    await this._authenticationsService.deleteRefreshToken(refreshToken)

    return {
      status: 'success',
      message: 'Berhasil Logout'
    }
  }
}

module.exports = AuthenticationHandler
