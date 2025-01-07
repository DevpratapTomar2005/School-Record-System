const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const generateTeacherRefreshToken = (user) => {
    return jwt.sign({ _id: user._id ,role:'Teacher'}, process.env.TOKEN_SECRET_KEY, { expiresIn: '1d' })
}
const generateTeacherAccessToken = (user) => {
    return jwt.sign({ 
        _id: user._id,
        email:user.emailid,
        schoolName:user.schoolname,
        subject:user.subject,
        role:'Teacher'
     }, process.env.TOKEN_SECRET_KEY, { expiresIn: '30m' })
}

module.exports={generateTeacherAccessToken,generateTeacherRefreshToken};