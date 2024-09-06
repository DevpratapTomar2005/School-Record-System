const express = require('express')
const path = require('path')
const app = express()
const port=3000
app.use(express.static(path.join(__dirname ,'public')))
app.set('view engine', 'ejs');
app.get('/', function (req, res) {
res.sendFile(path.join(__dirname,'/public/templates','student_register.html'))
})
app.get('/teacher-register', function (req, res) {
res.sendFile(path.join(__dirname,'/public/templates','teacher_register.html'))
})
app.get('/admin-register', function (req, res) {
res.sendFile(path.join(__dirname,'/public/templates','admin_register.html'))
})
app.get('/student-login', function (req, res) {
res.sendFile(path.join(__dirname,'/public/templates','student_login.html'))
})
app.get('/teacher-login', function (req, res) {
res.sendFile(path.join(__dirname,'/public/templates','teacher_login.html'))
})
app.get('/admin-login', function (req, res) {
res.sendFile(path.join(__dirname,'/public/templates','admin_login.html'))
})
app.get('/student-register', function (req, res) {
res.sendFile(path.join(__dirname,'/public/templates','student_register.html'))
})


app.listen(port, ()=>{
console.log(`server listening on PORT: ${port}`)
})