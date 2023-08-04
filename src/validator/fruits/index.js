const InvariantError = require('../../error/InvariantError')
const {
  FruitsPayloadSchema
} = require('./Schema')

const FruitsValidator = {
  validateFruitsPayload: (payload) => {
    const validationResult = FruitsPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = FruitsValidator
