const jwt = require('jsonwebtoken')
const config = require('../../config')
const db = require('../database')

const generate = (user) => {
  if (!user) {
    return Promise.reject({code: 400, message: `User is required`})
  }
  let payload = {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  }
  let timeoutInMinutes = config.jwt.expiresInMinutes
  let token = jwt.sign(payload, config.jwt.secret, {algorithm: config.jwt.algorithm, expiresIn: timeoutInMinutes * 60})
  delete user.password
  return Promise.resolve({user, token})
}

const verify = (token) => {
  try {
    let payload = jwt.verify(token, config.jwt.secret, {algorithm: config.jwt.algorithm})
    return db.query(`SELECT * FROM users WHERE username = ?`, [payload.user.username])
      .then((rs) => {
        if (rs && rs.length > 0) {
          delete rs[0].password
          return Promise.resolve(rs[0])
        }
        return Promise.reject('Access token is denied')
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      error.message = `Access token has expired - please get a new one and try again`
    } else if (error.name === 'JsonWebTokenError') {
      error.message = `Access token is invalid`
    }
    return Promise.reject(error.message ? error.message: error)
  }
}

module.exports = {generate, verify}
