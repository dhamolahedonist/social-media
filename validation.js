const Joi = require("joi");

const Validation = {
    async validateRegister(body) {
        const schema = Joi.object({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            email: Joi.string().email().required(),
            phone: Joi.string().length(11).pattern(/^[0-9]+$/).required(),
            twitter_handle: Joi.string().min(5).required(),
            instagram_handle: Joi.string().min(5).required(),
            password: Joi.string().regex(/^[\x20-\x7E]+$/).min(8).max(72).required(),   
            confirm_password:Joi.string().required().valid(Joi.ref('password')),
        })

        const validation = schema.validate(body)
        if(validation.error && validation.error.details.length > 0) {
            throw new Error(validation.error.details[0].message)
        }

        await db.phoneAlreadyExist(body.phone)
        await db.emailAlreadyExist(body.email)
        await db.twitterHandleAlreadyExist(body.twitter_handle)
        await db.instagramHandleAlreadyExist(body.instagram_handle)

    }
}

module.exports = Validation;