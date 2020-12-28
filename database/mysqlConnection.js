const mysql = require('mysql');
require('dotenv').config()
let env = process.env
const db = mysql.createConnection({
    host:env.DBHOST,
    user:env.DBUSERNAME,
    password:env.DBPASSWORD,
    database:'wound'
})

db.connect(function(err){
    if(err){
        console.log('Inside database> mysqlConnection.js DB error')
    }
})

module.exports = db