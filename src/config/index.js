require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', true)

const databases = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('Berhasil Connect ke Database')
  } catch (error) {
    console.error(error.message)
  }
}

const jwt = {
  accessTokenKey: process.env.ACCESS_TOKEN_KEY,
  refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
  accessTokenAge: process.env.ACCESS_TOKEN_AGE
}

const notification = {
  email: {
    username: process.env.EMAIL,
    password: process.env.PASSWORD_EMAIL
  },
  whatsApp: {
    host: process.env.WA_HOST,
    token: process.env.WA_TOKEN
  }
}

module.exports = {
  databases,
  jwt,
  notification
}
