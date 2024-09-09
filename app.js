const express = require('express')
const path = require('path')
const app = express()
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/schoolManagement');
const Admin = require('./src/models/admin.js')
const Teacher = require('./src/models/teacher.js')
const Student = require('./src/models/student.js')
const port = 3000

app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/templates', 'student_register.html'))
})
app.get('/teacher-register', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/templates', 'teacher_register.html'))
})
app.get('/admin-register', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/templates', 'admin_register.html'))
})
app.get('/student-login', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/templates', 'student_login.html'))
})
app.get('/teacher-login', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/templates', 'teacher_login.html'))
})
app.get('/admin-login', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/templates', 'admin_login.html'))
})
app.get('/student-register', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/templates', 'student_register.html'))
})
app.post('/student-register', async function (req, res) {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const rollnum = req.body.rollnum;
    const phonenumber = req.body.phonenumber;
    const schoolname = req.body.schoolname;
    const gender = req.body.gender;
    const password = req.body.password;
    const confirmPassword = req.body.confirmpassword;
    const studentClass = req.body.studentclass;
    try {
        if (password === confirmPassword) {
            const studentRegister = new Student({
                firstname: firstname,
                lastname: lastname,
                rollnum: rollnum,
                contactnum: phonenumber,
                schoolname: schoolname,
                gender: gender,
                password: password,
                class: studentClass
            })
            let registeredStudent = await studentRegister.save()
            console.log(registeredStudent)
        }
        else {
            res.send("Ivalid Credentials")
        }

    } catch (error) {
        res.send(`Error occured:${error} `)
    }
})

app.post('/teacher-register', async function (req, res) {
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
                firstname: firstname,
                lastname: lastname,
                emailid: teacherEmail,
                contactnum: phonenumber,
                schoolname: schoolname,
                gender: gender,
                password: password,
                subject: teacherSubject
            })
            let registeredTeacher = await teacherRegister.save()
            console.log(registeredTeacher)
        }
        else {
            res.send("Ivalid Credentials")
        }

    } catch (error) {
        res.send(`Error occured:${error} `)
    }
})
app.post('/admin-register', async function (req, res) {

    const schoolEmail = req.body.schoolemail;
    const phonenumber = req.body.phonenumber;
    const schoolname = req.body.schoolname;

    const password = req.body.password;
    const confirmPassword = req.body.confirmpassword;

    try {
        if (password === confirmPassword) {
            const adminRegister = new Admin({

                emailid: schoolEmail,
                contactnum: phonenumber,
                schoolname: schoolname,
                password: password

            })
            let registeredAdmin = await adminRegister.save()
            console.log(registeredAdmin)
        }
        else {
            res.send("Ivalid Credentials")
        }

    } catch (error) {
        res.send(`Error occured:${error} `)
    }
})


app.listen(port, () => {
    console.log(`server listening on PORT: ${port}`)
})