

const Teacher = require('../models/teacher.js')
const teacherRegister= async (req,res)=>{
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
            const teacherRegister = new Teacher({
                firstname: firstname.toLowerCase(),
                lastname: lastname.toLowerCase(),
                emailid: teacherEmail,
                contactnum: phonenumber,
                schoolname: schoolname.toLowerCase(),
                gender: gender,
                password: password,
                subject: teacherSubject.toLowerCase()
            })
            let teacherData = await teacherRegister.save()
            res.render('teacher_index', { teacherData })
        }
        else {
            res.send("Ivalid Credentials")
        }

    } catch (error) {
        res.send(`Error occured:${error} `)
    }
}


const teacherLogin= async (req,res)=>{
    try {

        const teacherName = req.body.teachername
        const teacherEmail = req.body.teacheremail
        const password = req.body.password
        let teacherFullname = teacherName.split(' ')
        let teacherData = await Teacher.findOne({ firstname: teacherFullname[0].toLowerCase(), lastname: teacherFullname[teacherFullname.length - 1].toLowerCase(), emailid: teacherEmail })
        if (password === teacherData.password) {
            res.render('teacher_index', { teacherData })
        }
        else {
            res.send('Invalid Credentials')
        }
    } catch (error) {
        res.status(400).send(`Error occured:${error} `)
    }
}

module.exports={
    teacherRegister,
    teacherLogin
}