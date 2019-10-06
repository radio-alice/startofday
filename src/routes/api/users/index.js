import express from 'express'
import { fetchUserFromJwt } from '../_middleware'
const router = express.Router()
export default router

router.get('/me', fetchUserFromJwt, (req, res) => {
  res.status(200).send(req.user)
})

router.put('/addName', fetchUserFromJwt, async (req, res) => {
  const user = req.user
  user.name = req.body.name
  await user.save()

  res.status(200).send(`${req.body.name} added to ${req.user.email}`)
})
