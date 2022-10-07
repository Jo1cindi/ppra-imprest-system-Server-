//configuring mysql db
const mysql = require("mysql")  //importing mysql
require('dotenv').config();


//mysql connection
const dbConnection = mysql.createConnection({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB,
});
dbConnection.connect((error)=>{
    if(error) throw error
    console.log("Database connected successfully")
});
setInterval(function () {
    dbConnection.query('SELECT 1');
}, 5000);
//exporting
module.exports = dbConnection;