const jwt = require('jsonwebtoken')

const generateRefreshToken = (user) => {
    return jwt.sign({ _id: user._id }, 'mynameisdev', { expiresIn: '1d' })
}
const generateAccessToken = (user) => {
    return jwt.sign({ 
        _id: user._id,
        email:user.emailid,
        schoolName:user.schoolname
     }, 'mynameisdev', { expiresIn: '30m' })
}

module.exports={generateAccessToken,generateRefreshToken};