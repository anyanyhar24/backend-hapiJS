const mongoose = require('mongoose')

const FruitsSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  waterPerGram: {
    type: Number,
    required: true
  },
  calorie: {
    type: Number,
    required: true
  },
  protein: {
    type: Number,
    required: true
  },
  fat: {
    type: Number,
    required: true
  },
  carbohydrate: {
    type: Number,
    required: true
  },
  vitamin: {
    type: String,
    required: true
  }
})

const Fruits = mongoose.model('Fruits', FruitsSchema)

module.exports = Fruits
