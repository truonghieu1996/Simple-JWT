module.exports = {
  port: {
    http: process.env.APP_PORT_HTTP || 3000
  },
  db: {
    host: process.env.APP_DB_HOST || 'localhost',
    port: process.env.APP_DB_PORT || 3306,
    name: process.env.APP_DB_NAME || 'app-demo',
    user: process.env.APP_DB_USER || 'root',
    password: process.env.APP_DB_PWD || '123456',
    poolSize: process.env.APP_DB_POOL_SIZE || 10,
    timeout: process.env.APP_DB_TIMEOUT || 60 * 60 * 1000
  },
  log: {
    dir: 'logs',
    filename: process.env.APP_LOG_FILE_NAME || 'events.log',
    size: process.env.APP_LOG_FILE_SIZE || 10485760,
    level: process.env.APP_LOG_LEVEL || 'debug' // trace > debug > info > warn > error > fatal
  },
  jwt: {
    secret: 'S3cr3t4JwtG3n3r4t10n',
    algorithm: 'HS256',
    expiresInMinutes: 30, // minutes
  },
  crypto: {
    secret: process.env.SECRET || 'This1s4Rand0m', // use to encrypt user password
    algorithm: 'aes192'
  }
}