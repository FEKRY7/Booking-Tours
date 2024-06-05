const joi = require('joi')

const SignUpSchema = joi.object({
    userName:joi.string().min(3).max(20).required(),
    email:joi.string().email().required(),
    password:joi.string().required(),
    phone:joi.string().required(),
    role:joi.string()
}).required()
 
const activateAcountSchema = joi.object({
    token :joi.string().required()
}).required()

const signInSchema = joi.object({
    email:joi.string().email().required(),
    password:joi.string().required()
})

module.exports = {
    SignUpSchema,
    activateAcountSchema,
    signInSchema
}