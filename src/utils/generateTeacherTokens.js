const jwt = require('jsonwebtoken')

const generateTeacherRefreshToken = (user) => {
    return jwt.sign({ _id: user._id ,role:'Teacher'}, 'mynameisdev', { expiresIn: '1d' })
}
const generateTeacherAccessToken = (user) => {
    return jwt.sign({ 
        _id: user._id,
        email:user.emailid,
        schoolName:user.schoolname,
        subject:user.subject,
        role:'Teacher'
     }, 'mynameisdev', { expiresIn: '30m' })
}

module.exports={generateTeacherAccessToken,generateTeacherRefreshToken};