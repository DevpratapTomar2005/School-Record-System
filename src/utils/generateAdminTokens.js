const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const generateAdminRefreshToken = (user) => {
    return jwt.sign({ _id: user._id,role:'Admin' }, process.env.TOKEN_SECRET_KEY, { expiresIn: '1d' })
}
const generateAdminAccessToken = (user) => {
    return jwt.sign({ 
        _id: user._id,
        email:user.emailid,
        schoolName:user.schoolname,
        role:'Admin'
     }, process.env.TOKEN_SECRET_KEY, { expiresIn: '30m' })
}

module.exports={generateAdminAccessToken,generateAdminRefreshToken};