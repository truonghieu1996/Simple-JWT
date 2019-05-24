const mysql = require('mysql')
const dbConfig = require('../../config').db
let pool = null

const getConnectionPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      connectionLimit: dbConfig.poolSize,
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.name,
      timeout: dbConfig.timeout,
      connectTimeout: dbConfig.timeout,
      acquireTimeout: dbConfig.timeout
    })
  }
  return pool
}

const query = (sql, injections) => {
  return new Promise((resolve, reject) => {
    getConnectionPool().query(sql, injections, (err, result) => {
      if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          setTimeout(() => {
            query(sql, injections)
              .then((result) => resolve(result))
              .catch((error) => reject(error))
          }, 2000)
        } else {
          reject(err)
        }
      } else {
        resolve(result)
      }
    })
  })
}

module.exports = { query }
