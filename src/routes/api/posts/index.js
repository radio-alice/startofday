import express from 'express'
import dayjs from 'dayjs'
import mongoose from 'mongoose'
import { Post, User } from '../_db'

const router = express.Router()
export default router
/**
 * Get an array of posts
 * @param {string} day - QUERY PARAM - post id to fetch query by
 */
router.get('/', async (req, res, next) => {
  const startDate = dayjs()
    .subtract(req.query.day, 'day')
    .startOf('day')
  const endDate = dayjs()
    .subtract(req.query.day, 'day')
    .endOf('day')

  try {
    const posts = await Post.find({
      date: { $gt: startDate.format(), $lt: endDate.format() }
    })
      .populate('author')
      .sort({ date: -1 })
      .exec()
    res.send(posts)
  } catch (err) {
    console.error(error)
    next(err)
  }
})

/**
 * Create a new post
 * @constructor
 * @param {string} author - the author of the commit
 */
router.post('/', async (req, res, next) => {
  try {
    const jwt = req.headers.authorization
      ? req.headers.authorization.split(' ')[1]
      : null

    const user = jwt
      ? await User.findByJWT(jwt)
      : await User.findOne({ email: req.body.author })
    const today = dayjs().startOf('day')
    const postToday = await Post.findOne({
      author: user._id,
      date: { $gt: today.format() }
    })
    if (postToday) return res.status(400).send("can't post twice in one day")

    const newPost = await new Post({
      post: req.body.post,
      author: user,
      date: new Date(),
      _id: new mongoose.Types.ObjectId(),
      links: []
    }).save()
    res.status(200).send('success')
  } catch (err) {
    next(err)
  }
})

router.put('/addLink', async (req, res, next) => {
  try {
    const jwt = req.headers.authorization.split(' ')[1]
    const user = await User.findByJWT(jwt)
    const post = await Post.findOne({ _id: req.body.postId })
    if (!user._id.equals(post.author._id))
      return res.status(403).send("you can't update someone else's post")
    post.links = [...post.links, req.body.url]
    await post.save()
    res.status(200).send('success')
  } catch (err) {
    res.status(500).send(err)
  }
})
