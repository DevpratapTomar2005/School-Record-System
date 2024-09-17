const jwt = require('jsonwebtoken')

const generateRefreshToken = (user) => {
    return jwt.sign({ _id: user._id }, 'mynameisdev', { expiresIn: '1d' })
}
const generateAccessToken = (user) => {
    return jwt.sign({ 
        _id: user._id,
        email:user.emailid,
        schoolName:user.schoolname,
        subject:user.subject
     }, 'mynameisdev', { expiresIn: '30s' })
}

module.exports={generateAccessToken,generateRefreshToken};