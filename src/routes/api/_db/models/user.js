const mongoose = require('mongoose')
const { Schema } = mongoose
const { verifyJWT } = require('../../_utils')

const userSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true
  },
  name: String,
  _id: Schema.Types.ObjectId
})

class UserClass {
  static async findOrCreate(email) {
    const user = await this.findOne({ email })
    if (user) return user

    const newUser = await this.create({
      email,
      _id: new mongoose.Types.ObjectId()
    })
    return newUser
  }

  static async findByJWT(jwt) {
    const { sub } = await verifyJWT(jwt)
    return this.findById(sub)
  }
}

userSchema.loadClass(UserClass)

module.exports = mongoose.model('User', userSchema)
