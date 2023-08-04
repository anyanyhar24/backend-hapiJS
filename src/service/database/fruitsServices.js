const Fruits = require('../../model/fruits')
const autoBind = require('auto-bind')
const { nanoid } = require('nanoid')
const InvariantError = require('../../error/InvariantError')
const NotFoundError = require('../../error/NotFoundError')

class FruitsServices {
  constructor () {
    this._fruits = Fruits

    autoBind(this)
  }

  async addFruits ({ name, waterPerGram, calorie, protein, fat, carbohydrate, vitamin }) {
    const id = `buah-${nanoid(16)}`

    const schema = {
      id,
      name,
      waterPerGram,
      calorie,
      protein,
      fat,
      carbohydrate,
      vitamin
    }

    const result = await this._fruits(schema)

    if (!result) {
      throw new InvariantError('Gagal Input Buah!')
    }

    result.save()
  }

  async getAllFruits () {
    const fruits = await this._fruits.find()

    if (!fruits.length) {
      throw new NotFoundError('Belum ada buah yang didaftarkan!')
    }

    return fruits
  }

  async getAllFruitsPaginate (page, limit) {
    const totalFruits = await this._fruits.countDocuments()
    const totalPages = Math.ceil(totalFruits / limit)
    const fruits = await this._fruits
      .find()
      .skip((page - 1) * limit)
      .limit(limit)

    if (!fruits) {
      throw new NotFoundError('Belum ada buah yang didaftarkan!')
    }

    return {
      totalFruits,
      page,
      totalPages,
      fruits
    }
  }

  async getFruitsById (id) {
    const fruits = await this._fruits.findOne({ id })

    if (!fruits) {
      throw new NotFoundError('Buah tidak ditemukan, Id tidak ada')
    }

    return fruits
  }

  async getFruitsByName (name) {
    const fruits = await this._fruits.findOne({ name })

    if (!fruits) {
      throw new NotFoundError('Buah tidak ditemukan, nama buah tidak ada')
    }

    return fruits
  }

  async updateFruitsById (id, { name, waterPerGram, calorie, protein, fat, carbohydrate, vitamin }) {
    const updatedFruits = await this._fruits.findOneAndUpdate(
      { id },
      {
        name,
        waterPerGram,
        calorie,
        protein,
        fat,
        carbohydrate,
        vitamin
      },
      { new: true }
    )

    if (!updatedFruits) {
      throw new NotFoundError('Gagal update buah, Id tidak ditemukan!')
    }
  }

  async deleteFruitsById (id) {
    const deletedFruit = await this._fruits.findOneAndDelete({ id })

    if (!deletedFruit) {
      throw new NotFoundError('Gagal Hapus buah, Id Tidak ditemukan!')
    }
  }
}

module.exports = FruitsServices
