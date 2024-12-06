const mysql = require('mysql2')

// Creates the connection with the db
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
})

connection.connect(err => {
  if (err) throw err
  console.log('Connected to MySQL!');
})


module.exports = connection;