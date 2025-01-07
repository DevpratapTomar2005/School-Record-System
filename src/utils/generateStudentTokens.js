const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config()
const generateStudentRefreshToken =function (user){
    return jwt.sign({ _id: user._id,  role:'Student' }, process.env.TOKEN_SECRET_KEY, { expiresIn: "1d" });
};
const generateStudentAccessToken =function (user){
    return jwt.sign({
        _id: user._id,
        rollnum: user.rollnum,
        schoolname: user.schoolname,
        studentClass: user.class,
        role:'Student'
    }, process.env.TOKEN_SECRET_KEY, { expiresIn: "30m" })
};

module.exports={generateStudentRefreshToken,generateStudentAccessToken};