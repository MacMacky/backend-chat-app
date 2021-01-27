require('dotenv').config({
  path: require('path').join(__dirname, '..', '.env')
})

const mysql = require('mysql2/promise')

mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
}).then(conn => {
  conn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, err => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log('database created succesfully...')
    conn.close()
    process.exit(0)
  })
}).catch(err => {
  console.log('Something went wrong when creating the database...')
  process.exit(1)
})