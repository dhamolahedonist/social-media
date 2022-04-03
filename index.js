const bcrypt = require('bcryptjs');
const express = require('express');
var cors = require('cors')
const Joi = require('joi');
const db = require('./db');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (request, response) => {
    return response.json({
        status: 'Successful',
        message: 'User registered successfully',
        data: []
    })
});

app.get('/api/get-user-details', async (request, response) => {
    const userDetails = await db.get()
    return response.json({
        status: 'Successful',
        message: 'User registered successfully',
        data: userDetails
    })
});

app.post('/api/register-account', async (request, response) => {
    
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

    const validation = schema.validate(request.body)
    if(validation.error && validation.error.details.length > 0) {
        return response.json ({
            status: 'Failed',
            message: validation.error.details[0].message,
            data: null
        }, 400)
    }

    let hash = '';
    try{
        hash = await bcrypt.hash(request.body.password, 10);
    } catch(e) {
        return response.json ({
            status: 'Failed',
            message: 'cannot encrypt password',
            data: null
        }, 400)
    }


    const phoneNumberExist = await db.phoneAlreadyExist(request.body.phone)
    const emailAddressExist = await db.emailAlreadyExist(request.body.email)
    const twitterHandleExist = await db.twitterHandleAlreadyExist(request.body.twitter_handle)
    const instagramHandleExist = await db.instagramHandleAlreadyExist(request.body.instagram_handle)

    if(phoneNumberExist) {
        return response.json ({
            status: 'failed',
            message: 'phone number already exist',
            data: null
        }, 400)
    }
    if(emailAddressExist) {
        return response.json ({
            status: 'failed',
            message: 'email already exist',
            data: null
        }, 400)
    }
    if(twitterHandleExist) {
        return response.json({
            status: 'failed',
            message: 'Twitter handle already exist',
            data: null
        }, 400)
    }

      if(instagramHandleExist) {
        return response.json({
            status: 'failed',
            message: 'Instagram handle already exist',
            data: null
        }, 400)
    }
    request.body.password = hash;
    db.create(request.body);

    return response.json({
        status: 'successful',
        message: 'user registered successfully',
        data: null
    })

});

const   port = process.env.PORT || 3000
console.log(`everything go dy alright laslas ${port}`)
app.listen(port)