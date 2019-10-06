const router = require('express').Router()
import authRoutes from './auth'
import postsRoutes from './posts'
import usersRoutes from './users'

router.use('/auth', authRoutes)
router.use('/posts', postsRoutes)
router.use('/users', usersRoutes)

export default router
