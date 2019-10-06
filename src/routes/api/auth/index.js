import express from 'express'
import { User } from '../_db'
import { generateLoginCode, sendTokenizedEmail, verifyJWT } from '../_utils'
const router = express.Router()
export default router

router.post('/', async (req, res, next) => {
  const email = req.body.email
  try {
    const user = await User.findOrCreate(email)
    const code = await generateLoginCode(user)
    await sendTokenizedEmail(email, code)
    return res.send('success').status(201)
  } catch (error) {
    next(error)
  }
})

router.get('/magic-link', async (req, res, next) => {
  const { sub } = await verifyJWT(req.query.token)
  const user = await User.findById(sub)
  if (user) {
    const code = await generateLoginCode(user)
    req.user = user
    req.jwt = req.query.token
    res.status(200).send(code)
  } else {
    next(new Error({ message: 'ERROR: no user found from JWT' }))
  }
})
