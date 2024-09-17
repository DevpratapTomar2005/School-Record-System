

const Teacher = require('../models/teacher.js')
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTeacherTokens.js')
const generateAccessAndRefreshTokens = async (user) => {
    try {
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
        console.log(accessToken, user)
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
                    subject: teacherSubject.toLowerCase()
                });

                res.render('teacher_index', { teacherData })
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
        const teacherEmail = req.body.teacheremail
        const password = req.body.password
        const teacherFullname = teacherName.split(' ')
        const teacherData = await Teacher.findOne({ firstname: teacherFullname[0].toLowerCase(), lastname: teacherFullname[teacherFullname.length - 1].toLowerCase(), emailid: teacherEmail })
        if (password === teacherData.password) {
            const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(teacherData)
            res.status(200).cookie('accessToken', accessToken, { httpOnly: true, secure: true }).cookie('refreshToken', refreshToken, { httpOnly: true, secure: true }).render('teacher_index',{teacherData})
        }
        else {
            res.send('Invalid Credentials')
        }
    } catch (error) {
        res.status(400).send(`Error occured:${error} `)
    }
}

module.exports = {
    teacherRegister,
    teacherLogin
}