const db = require('../database')
const crypto = require('../crypto')
const token = require('./token')
const logger = require('../logger')

const access = (req, res, next) => {
  if (!req.body.username) {
    return res.status(400).json({
      name: 'Bad Request',
      message: `'username' is required`
    })
  }
  if (!req.body.password) {
    return res.status(400).json({
      name: 'Bad Request',
      message: `'password' is required`
    })
  }

  return db.query(`SELECT * FROM users WHERE username = ?`, [req.body.username])
    .then(result => {
      if (result[0] && result[0].password && crypto.matches(req.body.password, result[0].password)) {
        return token.generate(result[0])
          .then((data) => res.status(200).json(data))
      }
      return res.status(400).json({
        name: 'Bad Request',
        message: 'Invalid username or password'
      })
    })
    .catch((err) => {
      return res.status(500).json(err)
    })
}

const authorize = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(400).json({
      name: 'Bad Request',
      message: 'Authorization token must be specified in request header'
    })
  }
  return token.verify(req.headers.authorization)
    .then(() => {
      return next()
    })
    .catch((err) => {
      logger.error(`Failed to validate token ${req.headers.authorization}`, err)
      return res.status(401).json({
        name: 'Unauthorized',
        message: err instanceof Object ? JSON.stringify(err) : err
      })
    })
}

module.exports = {access, authorize}
