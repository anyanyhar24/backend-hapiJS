const autoBind = require('auto-bind')

class UsersHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async postUserHandler (request, h) {
    this._validator.validateUserPayload(request.payload)

    const fullname = await this._service.addUser(request.payload)

    const response = h.response({
      status: 'success',
      message: `Berhasil registrasi akun ${fullname}`
    })
    response.code(201)
    return response
  }

  async getAllUserHandler () {
    const users = await this._service.getAllUsers()

    return {
      status: 'success',
      data: users
    }
  }

  async getAllUserByPaginateHandler (request) {
    const { page, limit } = request.query
    const users = await this._service.getAllUserspaginate(page, limit)

    return {
      status: 'success',
      data: users
    }
  }

  async getUserByIdHandler (request) {
    const { id } = request.params

    const user = await this._service.getUserById(id)

    return {
      status: 'success',
      data: user
    }
  }

  async putUserByIdHandler (request) {
    const { id } = request.params

    const fullname = await this._service.editUserById(id, request.payload)

    return {
      status: 'success',
      message: `Data ${fullname} telah berhasil diperbarui`
    }
  }

  async deleteUserByIdHandler (request) {
    const { id } = request.params

    const username = await this._service.deleteUserById(id)

    return {
      status: 'success',
      message: `Account ${username} telah berhasil dihapus`
    }
  }
}

module.exports = UsersHandler
