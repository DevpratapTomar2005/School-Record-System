const jwt = require('jsonwebtoken')

const generateAdminRefreshToken = (user) => {
    return jwt.sign({ _id: user._id,role:'Admin' }, 'mynameisdev', { expiresIn: '1d' })
}
const generateAdminAccessToken = (user) => {
    return jwt.sign({ 
        _id: user._id,
        email:user.emailid,
        schoolName:user.schoolname,
        role:'Admin'
     }, 'mynameisdev', { expiresIn: '30m' })
}

module.exports={generateAdminAccessToken,generateAdminRefreshToken};