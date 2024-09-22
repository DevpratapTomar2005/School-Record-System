

const Teacher = require('../models/teacher.js')
const jwt=require('jsonwebtoken')
const { generateTeacherAccessToken, generateTeacherRefreshToken } = require('../utils/generateTeacherTokens.js')
const generateAccessAndRefreshTokens = async (user) => {
    try {
        const accessToken = generateTeacherAccessToken(user)
        const refreshToken = generateTeacherRefreshToken(user)
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
       
        return { accessToken, refreshToken }
    } catch (error) {
        return res.status(400).send('something went wrong while generating tokens!')
    }
}
const teacherRegister = async (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const teacherEmail = req.body.teacheremail;
    const phonenumber = req.body.phonenumber;
    const schoolname = req.body.schoolname;
    const gender = req.body.gender;
    const password = req.body.password;
    const confirmPassword = req.body.confirmpassword;
    const teacherSubject = req.body.teachersubject;
     const imagePath="/images/userimg.png";
     
    try {
        if (password === confirmPassword) {
            const teacherExists = await Teacher.findOne({ firstname, lastname, emailid: teacherEmail, schoolname, subject: teacherSubject })
            if (!teacherExists) {

                const teacherData = await Teacher.create({
                    firstname: firstname.toLowerCase(),
                    lastname: lastname.toLowerCase(),
                    emailid: teacherEmail,
                    contactnum: phonenumber,
                    schoolname: schoolname.toLowerCase(),
                    gender: gender,
                    password: password,
                    subject: teacherSubject.toLowerCase(),
                    imagepath:imagePath
                });

                const { accessToken, refreshToken } = await generateAccessAndRefreshToken(teacherData._id)

                const options = {
                    httpOnly: true,
                    secure: true
                }
                return res.status(200).cookie("accessToken", accessToken, options).cookie('refreshToken', refreshToken, options).redirect('/teacher/');
            }
            else {
                return res.redirect('/teacher-login')
            }
        }
        else {
            res.send("Ivalid Credentials")
        }

    } catch (error) {
        res.send(`Error occured:${error} `)
    }
}


const teacherLogin = async (req, res) => {
    try {

        const teacherName = req.body.teachername
        const schoolname=req.body.schoolname
        const teacherEmail = req.body.teacheremail
        const password = req.body.password
        const teacherFullname = teacherName.split(' ')
        const teacherData = await Teacher.findOne({ firstname: teacherFullname[0].toLowerCase(), lastname: teacherFullname[teacherFullname.length - 1].toLowerCase(), emailid: teacherEmail ,schoolname:schoolname.toLowerCase()})
        if (password === teacherData.password) {
            const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(teacherData)
            res.status(200).cookie('accessToken', accessToken, { httpOnly: true, secure: true }).cookie('refreshToken', refreshToken, { httpOnly: true, secure: true }).redirect('/teacher/')
        }
        else {
            res.send('Invalid Credentials')
        }
    } catch (error) {
        res.status(400).send(`Error occured:${error} `)
    }
}

const teacherIndex= async (req,res)=>{
  try {
    const teacherInfo= await Teacher.findById(req.user._id).select('-password -refreshToken')
    res.status(201).render('teacher_index', { teacherInfo })
    
  } catch (error) {
    throw error;
  }
}
const teacherLogout = async (req, res) => {
    try {

        await Teacher.findByIdAndUpdate(req.user._id, { $set: { refreshToken: undefined } }, { new: true }).select('-password')
        const options = {
            httpOnly: true,
            secure: true
        }
        return res.status(201).clearCookie("accessToken", options).clearCookie("refreshToken", options).redirect('/teacher-login')
    } catch (error) {
        throw error;
    }
}
const refreshAccessToken = async (req, res) => {
    const oldRefreshToken = req.cookies?.refreshToken
const destUrl=req.query.destUrl

    try {
        if (!oldRefreshToken) {
            res.status(401).redirect('/teacher-login')
        }

        const verifiedOldToken = jwt.verify(oldRefreshToken, 'mynameisdev')
        const teacherRefresh = await Teacher.findById(verifiedOldToken?._id)

        if (!teacherRefresh) {
            res.status(401).send('Invalid Refresh Token!')
        }

        if (oldRefreshToken !== teacherRefresh?.refreshToken) {
            res.status(404).redirect('/teacher-login')
        }
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(teacherRefresh)

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
    teacherRegister,
    teacherLogin,
    teacherIndex,
    teacherLogout,
    refreshAccessToken
}