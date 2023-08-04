const Joi = require('joi')

const FruitsPayloadSchema = Joi.object({
  name: Joi.string().required(),
  waterPerGram: Joi.number().required(),
  calorie: Joi.number().required(),
  protein: Joi.number().required(),
  fat: Joi.number().required(),
  carbohydrate: Joi.number().required(),
  vitamin: Joi.string().required()
})

module.exports = {
  FruitsPayloadSchema
}
