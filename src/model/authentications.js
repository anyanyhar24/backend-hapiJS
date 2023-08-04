const mongoose = require('mongoose')

const authenticationsSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  idUser: {
    type: 'string',
    required: true
  }
})

const Authentications = mongoose.model('authentications', authenticationsSchema)

module.exports = Authentications
