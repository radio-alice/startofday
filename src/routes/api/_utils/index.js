const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

const sendTokenizedEmail = async (to, token) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  // send mail with defined transport object
  const info = await transporter.sendMail({
    to,
    subject: 'Share Your Work',
    text: 'Please click this link to continue signing in to Start of Day',
    html: `
      <div>
        <a href=http://localhost:3000?token=${token}>
          Sign in
        </a>
      </div>`
  })

  return info.messageId
}

const jwtOptions = {
  issuer: 'startofday.app',
  audience: 'startofday.app',
  algorithm: 'HS256'
}

const generateLoginCode = user =>
  new Promise((resolve, reject) => {
    return jwt.sign(
      { sub: user._id },
      process.env.LOGIN_SECRET_KEY,
      jwtOptions,
      (err, token) => {
        if (err) reject(err)
        else resolve(token)
      }
    )
  })

const verifyJWT = token =>
  new Promise((resolve, reject) => {
    return jwt.verify(
      token,
      process.env.LOGIN_SECRET_KEY,
      {},
      (err, decodedToken) => {
        if (err) reject(err)
        else resolve(decodedToken)
      }
    )
  })

module.exports = { sendTokenizedEmail, generateLoginCode, verifyJWT }
