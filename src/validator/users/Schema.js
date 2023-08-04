const Joi = require('joi')

const UserPayloadSchema = Joi.object({
  fullname: Joi.string().max(100).required(),
  username: Joi.string().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().required(),
  email: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  address: Joi.string().required(),
  role: Joi.string()
})

const UserPayloadActivatedSchema = Joi.object({
  isActive: Joi.boolean().required()
})

module.exports = {
  UserPayloadSchema,
  UserPayloadActivatedSchema
}
