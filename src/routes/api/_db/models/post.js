const mongoose = require('mongoose')
const { Schema } = mongoose
const url = require('url')

const postSchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "can't be blank"],
    index: true,
    lowercase: true
  },
  post: {
    type: String,
    required: [true, "can't be blank"]
  },
  date: {
    type: Date,
    required: [true, "can't be blank"]
  },
  _id: Schema.Types.ObjectId,
  links: [
    {
      type: String,
      validate: url => {
        try {
          new URL(url)
          return true
        } catch (_err) {
          return false
        }
      }
    }
  ]
})

module.exports = mongoose.model('Post', postSchema)
