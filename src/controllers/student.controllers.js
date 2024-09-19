
const Student = require('../models/student.js');
const { generateStudentRefreshToken, generateStudentAccessToken } = require('../utils/generateStudentTokens.js')
const jwt = require('jsonwebtoken')
const generateAccessAndRefreshToken = async (studentId) => {
    try {
        const student = await Student.findById(studentId)
        
        const accessToken = generateStudentAccessToken(student);
        const refreshToken = generateStudentRefreshToken(student);
        // console.log(accessToken,refreshToken)
        student.refreshToken = refreshToken;
        await student.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error('Some thing went wrong while generating tokens')
    }

}

const studentRegister = async (req, res) => {
    try {

        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const rollnum = req.body.rollnum;
        const phonenumber = req.body.phonenumber;
        const schoolname = req.body.schoolname;
        const gender = req.body.gender;
        const password = req.body.password;
        const confirmPassword = req.body.confirmpassword;
        const studentClass = req.body.studentclass;
        if (password === confirmPassword) {

            const studentExists = await Student.findOne({ rollnum, schoolname: schoolname.toLowerCase(), class: studentClass });
            if (!studentExists) {
                const studentData = await Student.create({
                    firstname: firstname.toLowerCase(),
                    lastname: lastname.toLowerCase(),
                    rollnum,
                    contactnum: phonenumber,
                    schoolname: schoolname.toLowerCase(),
                    gender,
                    password,
                    class: studentClass
                });
                const { accessToken, refreshToken } = await generateAccessAndRefreshToken(studentData._id)

                const options = {
                    httpOnly: true,
                    secure: true
                }
                return res.status(200).cookie("accessToken", accessToken, options).cookie('refreshToken', refreshToken, options).redirect('/student/');
            }
            else {
                return res.redirect('/student-login');
            }
        }
        else {
            return res.send("Invalid Credential!!")
        }



    } catch (error) {
        return res.send(`Error occured:${error} `)
    }
};




const studentLogin = async (req, res) => {
    try {

        const studentClass = req.body.studentclass
        const rollnum = req.body.rollnum
        const password = req.body.password
        const studentData = await Student.findOne({ rollnum: rollnum, class: studentClass, password })

        if (!studentData) {
          return  res.send('Invalid Credentials')
        }
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(studentData._id)

        const options = {
            httpOnly: true,
            secure: true
        }
     return   res.status(200).cookie("accessToken", accessToken, options).cookie('refreshToken', refreshToken, options).redirect('/student/');

    } catch (error) {
        console.error(error)
        res.status(400).send(`Error:${error} `)
    }

};
const studentIndex = async (req, res) => {
    try {

        const studentInfo = await Student.findById(req.user._id).select('-password -refreshToken');
        res.status(201).render('student_index', { studentInfo })

    } catch (error) {
        throw error;
    }

}

const studentLogout = async (req, res) => {
    try {

        await Student.findByIdAndUpdate(req.user._id, { $set: { refreshToken: undefined } }, { new: true }).select('-password')
        const options = {
            httpOnly: true,
            secure: true
        }
        return res.status(201).clearCookie("accessToken", options).clearCookie("refreshToken", options).redirect('/student-login')
    } catch (error) {
        throw error;
    }
}

const refreshAccessToken = async (req, res) => {
    const oldRefreshToken = req.cookies?.refreshToken
const destUrl=req.query.destUrl

    try {
        if (!oldRefreshToken) {
            res.status(401).redirect('/student-login')
        }

        const verifiedOldToken = jwt.verify(oldRefreshToken, 'mynameisdev')
        const studentRefresh = await Student.findById(verifiedOldToken?._id)

        if (!studentRefresh) {
            res.status(401).send('Invalid Refresh Token!')
        }

        if (oldRefreshToken !== studentRefresh?.refreshToken) {
            res.status(404).redirect('/student-login')
        }
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(studentRefresh._id)

        const options = {
            httpOnly: true,
            secure: true
        }
       
        res.status(200).cookie('accessToken', accessToken, options).cookie('refreshToken', refreshToken, options).redirect(`${destUrl}`)
    } catch (error) {
        res.status(400).send(error)
    }

}
module.exports = {
    studentRegister,
    studentLogin,
    studentIndex,
    studentLogout,
    refreshAccessToken
}