const express = require('express')
const path = require('path')
const app = express()
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/schoolManagement');
const Admin = require('./src/models/admin.js')
const Teacher = require('./src/models/teacher.js')
const Student = require('./src/models/student.js');

const port = 3000

app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname ,'public/views'))
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
                firstname: firstname.toLowerCase(),
                lastname: lastname.toLowerCase(),
                rollnum: rollnum,
                contactnum: phonenumber,
                schoolname: schoolname.toLowerCase(),
                gender: gender,
                password: password,
                class: studentClass
            })
            let studentData= await studentRegister.save();

          
            res.render('student_index',{
                studentData
            })
          
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
            res.render('teacher_index',{teacherData})
        }
        else {
            res.send("Ivalid Credentials")
        }

    } catch (error) {
        res.send(`Error occured:${error} `)
    }
})
app.post('/admin-register', async function (req, res) {

    
    try {
        const schoolEmail = req.body.schoolemail;
        const phonenumber = req.body.phonenumber;
        const schoolname = req.body.schoolname;
    
        const password = req.body.password;
        const confirmPassword = req.body.confirmpassword;
        if (password === confirmPassword) {
            const adminRegister = new Admin({

                emailid: schoolEmail,
                contactnum: phonenumber,
                schoolname: schoolname.toLowerCase(),
                password: password

            })
            let adminData= await adminRegister.save()
            res.render('admin_index',{adminData})
        }
        else {
            res.send("Ivalid Credentials")
        }

    } catch (error) {
        res.status(400).send(`Error occured:${error} `)    
    }
})
app.post('/student-login',async (req,res) => {
    try {
        
        const studentClass=req.body.studentclass
        const rollnum=req.body.rollnum
        const password=req.body.password
        let studentData=await Student.findOne({rollnum:rollnum, class:studentClass})
        if(password===studentData.password){
            
            res.render('student_index',{
               studentData
            })
          
        }
        else{
            res.send('Invalid Credentials')
        }
    } catch (error) {
        console.error(error)
        res.status(400).send(`Error occured:${error} `)
    }
})
app.post('/teacher-login',async (req,res) => {
    try {
        
        const teacherName=req.body.teachername
        const teacherEmail=req.body.teacheremail
        const password=req.body.password
        let teacherFullname=teacherName.split(' ')
        let teacherData=await Teacher.findOne({ firstname:teacherFullname[0].toLowerCase(), lastname:teacherFullname[teacherFullname.length-1].toLowerCase(), emailid:teacherEmail})
        if(password===teacherData.password){
            res.render('teacher_index',{teacherData})
        }
        else{
            res.send('Invalid Credentials')
        }
    } catch (error) {
        res.status(400).send(`Error occured:${error} `)
    }
})
app.post('/admin-login',async (req,res) => {
    try {
        
        const schoolName=req.body.schoolname
        const schoolEmail=req.body.schoolemail
        const password=req.body.password
        
        let adminData=await Admin.findOne({schoolname:schoolName.toLowerCase(), emailid:schoolEmail })
        if(password===adminData.password){
            res.render('admin_index',{adminData})
        }
        else{
            res.send('Invalid Credentials')
        }
    } catch (error) {
        res.status(400).send(`Error occured:${error} `)
    }
})

app.listen(port, () => {
    console.log(`server listening on PORT: ${port}`)
})