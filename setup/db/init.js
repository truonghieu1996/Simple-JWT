const mysql = require('mysql')
const path = require('path')
const config = require('../../server/config')
const host = process.env.APP_DB_HOST || config.db.host
const user = process.env.APP_DB_USER || config.db.user
const password = process.env.APP_DB_PWD || config.db.password
const databaseName = process.env.APP_DB_NAME || config.db.name
const port = process.env.APP_DB_PORT || config.db.port
const cryptoJS = require('crypto-js')
const fs = require('fs')
const secret = process.env.SECRET

const connection = mysql.createConnection({
  host: host,
  user: user,
  port: port,
  password: password,
  multipleStatements: true
})

function encrypt(plainText) {
  return cryptoJS.AES.encrypt(plainText, secret)
}

connection.connect(function (err) {
  if (err) {
    console.error('Failed to connect to mysql')
    throw err
  }
  console.log('Connect successfully')
  createDatabase()
    .then(() => {
      let sql = fs.readFileSync(path.join(__dirname, 'init.sql')).toString()
      const regex = /'(\$(.+)\$)'/
      sql = regex.test(sql) ? sql.replace(sql.match(regex)[1], encrypt(sql.match(regex)[2])) : sql
      connection.query(sql, function(err, result) {
        if (err) {
          throw err
        }
        console.log('Done')
        connection.end()
    })
    })
})

const createDatabase = () => {
  return new Promise((resolve, reject) => {
    connection.query(`DROP DATABASE IF EXISTS ${databaseName}`, err => {
      if (err) reject(err)
      console.log(`Drop database ${databaseName}`)
      connection.query(`CREATE DATABASE ${databaseName}`, err => {
        if (err) reject(err)
        console.log(`Database ${databaseName} is created successfully`)
        connection.query(`USE ${databaseName}`, err => {
          if (err) reject(err)
          console.log(`Use database ${databaseName}`)
          resolve()
        })
      })
    })
  })
}
