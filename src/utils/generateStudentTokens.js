const jwt = require('jsonwebtoken');
const SECRET_KEY = 'mynameisdev';
const generateStudentRefreshToken =function (user){
    return jwt.sign({ _id: user._id,  role:'Student' }, SECRET_KEY, { expiresIn: "1d" });
};
const generateStudentAccessToken =function (user){
    return jwt.sign({
        _id: user._id,
        rollnum: user.rollnum,
        schoolname: user.schoolname,
        studentClass: user.class,
        role:'Student'
    }, SECRET_KEY, { expiresIn: "30m" })
};

module.exports={generateStudentRefreshToken,generateStudentAccessToken};