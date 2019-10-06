import sirv from 'sirv'
import express from 'express'
import cors from 'cors'
import * as sapper from '@sapper/server'
import path from 'path'
import session from 'express-session'
import compression from 'compression'
import mongoose from 'mongoose'
import api from './routes/api'

require('dotenv').config()
const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'
const app = express()
module.exports = app

const createApp = () => {
  app.use(
    cors(),
    compression({ threshold: 0 }),
    express.json(),
    express.urlencoded({ extended: true }),
    sirv('static', { dev })
  )
  app.use('/api', api)
  // express sessions
  app.use(
    session({
      secret: 'my best friend is Cody',
      resave: true,
      saveUninitialized: true
    })
  )
  app.use(
    sapper.middleware({
      session: (req, res) => ({
        user: req.user,
        jwt: req.jwt
      })
    })
  )
  // any remaining requests with an extension (.js, .css, etc.) send 404
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found')
      err.status = 404
      next(err)
    } else {
      next()
    }
  })

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
  })
}

const startListening = () => {
  app.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`))
}

const startDb = () => {
  mongoose.connect('mongodb://localhost/linksDB', { useNewUrlParser: true })
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', async () => {
    await createApp()
    await startListening()
  })
}

async function bootApp() {
  await startDb()
}

if (require.main === module) {
  bootApp()
} else {
  createApp()
}
