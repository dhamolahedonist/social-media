const bcrypt = require('bcryptjs')
const express = require('express')
var cors = require('cors')
const db = require('./db')
const Validation = require('./validation')
const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (request, response) => {
    return response.json({
        status: 'Successful',
        message: 'User registered successfully',
        data: []
    })
})

app.get('/api/get-user-details', async (request, response) => {
    const userDetails = await db.get()
    return response.json({
        status: 'Successful',
        message: 'User registered successfully',
        data: userDetails
    })
})

app.post('/api/register-account', async (request, response) => {
    
    try {

        await Validation.validateRegister(request.body)
        request.body.password = await bcrypt.hash(request.body.password, 10)
        db.create(request.body)

        return response.json({
            status: 'successful',
            message: 'user registered successfully',
            data: null
        })

    }catch(error) {
         return response.json ({
            status: 'Failed',
            message: error.message,
            data: null
        }, 400)
    }
})

const   port = process.env.PORT || 3000
console.log(`everything go dy alright laslas ${port}`)
app.listen(port)