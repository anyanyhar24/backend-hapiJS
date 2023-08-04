const autoBind = require('auto-bind')

class FruitsHandler {
  constructor (service) {
    this._service = service

    autoBind(this)
  }

  async PostFruitsHandler (request) {
    await this._service.addFruits(request.payload)

    return {
      status: 'success',
      message: 'Berhasil menambahkan data buah'
    }
  }

  async getAllFruitsHandler () {
    const fruits = await this._service.getAllFruits()

    return {
      status: 'success',
      data: fruits
    }
  }

  async getAllFruitsWithPaginateHandler (request) {
    const { page, limit } = request.query
    const fruits = await this._service.getAllFruitsPaginate(page, limit)

    return {
      status: 'success',
      data: fruits
    }
  }

  async getFruitsByIdHandler (request) {
    const { id } = request.params

    const fruit = await this._service.getFruitsById(id)

    return {
      status: 'success',
      data: fruit
    }
  }

  async getFruitsByNameHandler (request) {
    const { name } = request.params

    const fruit = await this._service.getFruitsByName(name)

    return {
      status: 'success',
      data: fruit
    }
  }

  async PutFruitsHandler (request) {
    const { id } = request.params

    await this._service.updateFruitsById(id, request.payload)

    return {
      status: 'success',
      message: 'Berhasil edit data buah'
    }
  }

  async deleteFruitsByIdHandler (request) {
    const { id } = request.params

    await this._service.deleteFruitsById(id)

    return {
      status: 'success',
      message: 'Buah telah berhasil dihapus'
    }
  }
}

module.exports = FruitsHandler
