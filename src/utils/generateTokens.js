const jwt = require('jsonwebtoken');
const SECRET_KEY = 'mynameisdev';
const generateRefreshToken =function (user){
    return jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: "30d" });
};
const generateAccessToken =function (user){
    return jwt.sign({
        _id: user._id,
        rollnum: user.rollnum,
        schoolname: user.schoolname,
        studentClass: user.class
    }, SECRET_KEY, { expiresIn: "30d" })
};

module.exports={generateRefreshToken,generateAccessToken};