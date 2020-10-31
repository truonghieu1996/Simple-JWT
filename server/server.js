const http = require('http')
const express = require('express')
const config = require('./config')
const logger = require('./modules/logger')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Last-Modified', (new Date()).toUTCString()) // to avoid 304
  logger.trace(`${req.method} ${req.originalUrl}`)
  next()
})

app.use('/api/auth', require('./modules/auth').access)

app.use((req, res, next) => {
  res.status(404).json({ message: `CANNOT ${req.method} API ${req.originalUrl}` })
})

app.use((err, req, res, next) => {
  if (err instanceof Error) {
    logger.error(err.stack)
    res.status(500).json({
      message: `Server Error`,
      detail: err.stack
    })
  } else {
    logger.error(err)
    res.status(err.code || 500).json(err)
  }
})

const server = http.createServer(app)
server.listen(config.port.http, () => {
  logger.log('running server on port %d', config.port.http)
})
