const InvariantError = require('../../error/InvariantError')
const {
  UserPayloadSchema,
  UserPayloadActivatedSchema
} = require('./Schema')

const UsersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validateUserActivatedSchema: (payload) => {
    const validationResult = UserPayloadActivatedSchema.validate(payload)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = UsersValidator
