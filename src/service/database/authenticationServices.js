const Authentications = require('../../model/authentications')
const InvariantError = require('../../error/InvariantError')

class AuthenticationsServices {
  constructor () {
    this._authentication = Authentications
  }

  async addRefreshToken (token, idUser) {
    const schema = {
      token,
      idUser
    }

    const result = await this._authentication(schema)
    await result.save()
  }

  async verifyRefreshToken (token) {
    const result = await this._authentication.findOne({ token })

    if (!result) {
      throw new InvariantError('Refresh Token Tidak Valid')
    }
  }

  async deleteRefreshToken (token) {
    await this._authentication.findOneAndDelete({ token })
  }
}

module.exports = AuthenticationsServices
