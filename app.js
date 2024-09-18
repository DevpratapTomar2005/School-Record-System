const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/schoolManagement');
const cookieParser=require('cookie-parser')
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
//route for redirecting the user to thier respective index pages automatically when user goes on '/' 
const homeRoutes=require('./src/routes/home.routes.js')
app.use('/',homeRoutes)
//register and login page navigation routes 

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
// routes for login and register user
const studentRoutes = require("./src/routes/student.routes.js");
const teacherRoutes = require("./src/routes/teacher.routes.js");
const adminRoutes = require("./src/routes/admin.routes.js");


app.use('/student', studentRoutes);
app.use('/teacher', teacherRoutes);
app.use('/admin', adminRoutes);




app.listen(port, () => {
    console.log(`server listening on PORT: ${port}`)
})