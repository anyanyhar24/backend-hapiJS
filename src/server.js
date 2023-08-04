require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const colors = require('colors')

const ClientError = require('./error/ClientError')

const users = require('./api/user')
const UsersService = require('./service/database/userServices')
const UsersValidator = require('./validator/users')

const fruits = require('./api/fruits')
const FruitsService = require('./service/database/fruitsServices')
const FruitsValidator = require('./validator/fruits')

const authentications = require('./api/authentication')
const AuthenticationsService = require('./service/database/authenticationServices')
const TokenManager = require('./jwt/TokenManager')
const AuthenticationsValidator = require('./validator/auth')

const AuthorizationServices = require('./service/middleware/AuthorizationServices')

const {
  databases,
  jwt
} = require('./config/index')

const {
  accessTokenKey,
  accessTokenAge
} = jwt

const init = async () => {
  const userService = new UsersService()
  const fruitService = new FruitsService()
  const authenticationService = new AuthenticationsService()
  const authorizationService = new AuthorizationServices(userService)

  const server = Hapi.Server({
    host: 'localhost',
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register([
    {
      plugin: Jwt
    }
  ])

  server.auth.strategy('jwt_fruits_clasification', 'jwt', {
    keys: accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: accessTokenAge
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
  })

  await server.register([
    {
      plugin: users,
      options: {
        service: userService,
        authorizationService,
        validator: UsersValidator
      }
    },
    {
      plugin: fruits,
      options: {
        service: fruitService,
        validator: FruitsValidator
      }
    },
    {
      plugin: authentications,
      options: {
        authenticationService,
        userService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator
      }
    }
  ])

  server.route({
    method: 'GET',
    path: '/',
    handler: () => {
      return '<h1>Selamat Datang pada Server Hapi API CNN Klasifikasi Buah</h1>'
    }
  })

  server.ext('onPreResponse', (request, h) => {
    const { response } = request
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message
        })
        newResponse.code(response.statusCode)
        console.error(`${colors.red(`Error ${newResponse.statusCode}`)} ${colors.yellow(`${newResponse.source.message}`)}`)
        return newResponse
      }
      if (!response.isServer) {
        return h.continue
      }
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami'
      })
      newResponse.code(500)
      console.error(newResponse)
      return newResponse
    }
    return h.continue
  })

  await databases()
  await server.start()
  console.log(`Server Running on ${server.info.uri}`)
}

init()
