const mysql = require('mysql2');

const DB = {
    init() {
        return mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            port: '3306',
            database: 'socialmedia' 
            // mysql.createConnection({
            // host: 'db4free.net',
            // user: 'social_influenza',
            // password: 'Passme@123',
            // port: '3306',
            // database: 'social_influenza' 
        })
    },

    async get() {
        const value = await DB.init().promise().query(`select * from users`)
        return value[0]
    },
    create(payload) {
        const { first_name, last_name, email, phone, twitter_handle, instagram_handle, password } = payload

        DB.init().promise().query(`
        INSERT INTO users 
        (first_name, last_name, email, phone, twitter_handle, instagram_handle, password)
        VALUES ('${first_name}', '${last_name}', '${email}', '${phone}', '${twitter_handle}', '${instagram_handle}', '${password}')
        `)
    },

    async emailAlreadyExist(email) {
        const value = await DB.init().promise().query(`select email from users where email = '${email}'`)
        return value[0].length > 0
    },

    async phoneAlreadyExist(phone) {
        const value = await DB.init().promise().query(`select phone from users where phone = '${phone}'`)
        return value[0].length > 0
    },

    async twitterHandleAlreadyExist(twitter_handle) {
        const value = await DB.init().promise().query(`select twitter_handle from users where twitter_handle = '${twitter_handle}'`)
        return value[0].length > 0
    },

     async instagramHandleAlreadyExist(instagram_handle) {
        const value = await DB.init().promise().query(`select instagram_handle from users where instagram_handle = '${instagram_handle}'`)
        return value[0].length > 0
     }    

}

module.exports = DB;